package inzynierka.myhotelassistant.services.statisics

import inzynierka.myhotelassistant.repositories.RepositoryExtensions
import inzynierka.myhotelassistant.repositories.ReservationsRepository
import inzynierka.myhotelassistant.repositories.RoomRepository
import inzynierka.myhotelassistant.repositories.ScheduleRepository
import org.springframework.stereotype.Service
import smile.data.DataFrame
import smile.data.Tuple
import smile.data.formula.Formula
import smile.data.type.StructType
import smile.data.vector.DoubleVector
import smile.regression.LinearModel
import smile.regression.OLS
import smile.regression.RandomForest
import java.time.LocalDate
import kotlin.math.pow
import kotlin.math.roundToInt

@Service
class MLPredictionService(
    private val reservationsRepository: ReservationsRepository,
    private val scheduleRepository: ScheduleRepository,
    private val roomRepository: RoomRepository,
    private val repositoryExtensions: RepositoryExtensions,
) {
    data class MLPredictionResult(
        val predictions: List<DailyPrediction>,
        val accuracyRevenue: Double,
        val accuracyOccupancy: Double,
        val modelType: String,
    )

    data class DailyPrediction(
        val date: LocalDate,
        val predictedRevenue: Double,
        val predictedOccupancy: Int,
        val confidence: Double,
    )

    data class TrainingData(
        val dates: List<LocalDate>,
        val revenues: DoubleArray,
        val occupancies: DoubleArray,
        val features: Array<DoubleArray>,
    )

    fun predictWithML(daysAhead: Int = 30): MLPredictionResult {
        val today = LocalDate.now()
        val trainingData = prepareTrainingData(today.minusDays(90), today)

        if (trainingData.revenues.size < 10 || trainingData.occupancies.size < 10) {
            return createFallbackPrediction(daysAhead, "Insufficient data")
        }

        try {
            val featureCount = trainingData.features.firstOrNull()?.size ?: 0
            val featureNames = Array(featureCount) { i -> "f$i" }

            val featureMatrix: Array<DoubleArray> = trainingData.features
            val dfFeatures = DataFrame.of(featureMatrix, *featureNames)
            val dfRevenue =
                dfFeatures
                    .merge(DoubleVector.of("revenue", trainingData.revenues))
            val dfOccupancy =
                dfFeatures
                    .merge(DoubleVector.of("occupancy", trainingData.occupancies))

            val formulaRevenue = Formula.lhs("revenue")
            val formulaOccupancy = Formula.lhs("occupancy")

            val revenueModel = RandomForest.fit(formulaRevenue, dfRevenue)
            val occupancyModel = OLS.fit(formulaOccupancy, dfOccupancy)

            val predictions = mutableListOf<DailyPrediction>()
            for (i in 1..daysAhead) {
                val date = today.plusDays(i.toLong())
                val features = extractDateFeatures(date)

                val predictedRevenue =
                    try {
                        revenueModel.predict(Tuple.of(features, dfRevenue.schema())).coerceAtLeast(0.0)
                    } catch (ex: Exception) {
                        0.0
                    }
                val predictedOccupancy =
                    try {
                        occupancyModel.predict(Tuple.of(features, dfOccupancy.schema())).coerceIn(0.0, 100.0)
                    } catch (ex: Exception) {
                        0.0
                    }

                predictions.add(
                    DailyPrediction(
                        date = date,
                        predictedRevenue = ((predictedRevenue.times(100)).roundToInt() / 100).toDouble(),
                        predictedOccupancy = predictedOccupancy.roundToInt(),
                        confidence = calculateConfidence(i, trainingData.revenues.size),
                    ),
                )
            }

            val accuracyRevenue = calculateR2Score(revenueModel, trainingData.features, trainingData.revenues, dfRevenue.schema())
            val accuracyOccupancy = calculateR2Score(occupancyModel, trainingData.features, trainingData.occupancies, dfOccupancy.schema())

            return MLPredictionResult(
                predictions = predictions,
                accuracyRevenue = accuracyRevenue,
                accuracyOccupancy = accuracyOccupancy,
                modelType = "RandomForest (Revenue) + OLS (Occupancy)",
            )
        } catch (e: Exception) {
            return createFallbackPrediction(daysAhead, "Model error: ${e.message}")
        }
    }

    private fun prepareTrainingData(
        startDate: LocalDate,
        endDate: LocalDate,
    ): TrainingData {
        val dates = mutableListOf<LocalDate>()
        val revenues = mutableListOf<Double>()
        val occupancies = mutableListOf<Double>()
        val features = mutableListOf<DoubleArray>()

        var date = startDate
        while (!date.isAfter(endDate)) {
            dates.add(date)
            revenues.add(calculateRevenueForDay(date))
            occupancies.add(calculateOccupancyForDay(date))
            features.add(extractDateFeatures(date))
            date = date.plusDays(1)
        }

        return TrainingData(
            dates = dates,
            revenues = revenues.toDoubleArray(),
            occupancies = occupancies.toDoubleArray(),
            features = features.toTypedArray(),
        )
    }

    private fun extractDateFeatures(date: LocalDate): DoubleArray =
        doubleArrayOf(
            date.dayOfWeek.value.toDouble(),
            date.dayOfMonth.toDouble(),
            date.monthValue.toDouble(),
            if (date.dayOfWeek.value >= 6) 1.0 else 0.0,
            date.dayOfYear.toDouble() / 365.0,
        )

    private fun calculateRevenueForDay(date: LocalDate): Double {
        val reservationRevenue =
            reservationsRepository
                .sumReservationPriceByCheckInBetweenAndPaidIsTrue(date, date.plusDays(1)) ?: 0.0
        val serviceRevenue =
            scheduleRepository
                .sumPriceByOrderTimeBetween(date.atStartOfDay(), date.plusDays(1).atStartOfDay()) ?: 0.0
        return reservationRevenue + serviceRevenue
    }

    private fun calculateOccupancyForDay(date: LocalDate): Double {
        val totalRooms = roomRepository.count().toDouble()
        if (totalRooms == 0.0) return 0.0
        val occupiedRooms = repositoryExtensions.countOccupiedRoomsOnDate(date)
        return (occupiedRooms / totalRooms) * 100.0
    }

    private fun calculateConfidence(
        daysAhead: Int,
        dataSize: Int,
    ): Double {
        val distanceFactor = 1.0 - (daysAhead / 100.0).coerceIn(0.0, 0.5)
        val dataFactor = (dataSize / 100.0).coerceIn(0.3, 1.0)
        return (distanceFactor * dataFactor * 100.0).coerceIn(0.0, 100.0)
    }

    private fun calculateR2Score(
        model: Any,
        features: Array<DoubleArray>,
        actual: DoubleArray,
        schema: StructType,
    ): Double {
        val predictions = DoubleArray(actual.size)
        for (i in features.indices) {
            val tuple = Tuple.of(features[i], schema)
            val pred =
                when (model) {
                    is RandomForest -> model.predict(tuple)
                    is LinearModel -> model.predict(tuple)
                    else -> 0.0
                }
            predictions[i] = pred
        }
        return calculateR2(predictions, actual)
    }

    private fun calculateR2(
        pred: DoubleArray,
        actual: DoubleArray,
    ): Double {
        if (actual.isEmpty()) return 0.0
        val mean = actual.average()
        val ssTotal = actual.sumOf { (it - mean).pow(2) }
        val ssRes = actual.zip(pred).sumOf { (a, p) -> (a - p).pow(2) }
        return if (ssTotal > 0) (1.0 - ssRes / ssTotal).coerceIn(0.0, 1.0) else 0.0
    }

    private fun createFallbackPrediction(
        daysAhead: Int,
        reason: String,
    ): MLPredictionResult {
        val today = LocalDate.now()
        val fallbackPredictions =
            (1..daysAhead).map { i ->
                DailyPrediction(today.plusDays(i.toLong()), 0.0, 0, 0.0)
            }

        return MLPredictionResult(
            predictions = fallbackPredictions,
            accuracyRevenue = 0.0,
            accuracyOccupancy = 0.0,
            modelType = "Fallback - $reason",
        )
    }
}
