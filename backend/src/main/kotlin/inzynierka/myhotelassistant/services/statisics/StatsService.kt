package inzynierka.myhotelassistant.services.statisics

import inzynierka.myhotelassistant.models.reservation.ReservationStatus
import inzynierka.myhotelassistant.repositories.RepositoryExtensions
import inzynierka.myhotelassistant.repositories.ReservationsRepository
import inzynierka.myhotelassistant.repositories.RoomRepository
import inzynierka.myhotelassistant.repositories.ScheduleRepository
import inzynierka.myhotelassistant.repositories.ServiceRepository
import org.springframework.stereotype.Service
import java.time.DayOfWeek
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.LocalTime
import java.time.temporal.ChronoUnit
import kotlin.math.abs

@Service
class StatsService(
    private val scheduleRepository: ScheduleRepository,
    private val reservationsRepository: ReservationsRepository,
    private val roomRepository: RoomRepository,
    private val repositoryExtensions: RepositoryExtensions,
    private val serviceRepository: ServiceRepository,
) {
    data class ServiceStat(
        val id: Int,
        val name: String,
        val orderCount: Long? = null,
        val revenue: String? = null,
    )

    data class ExtendedStatsResponse(
        val predictions: PredictionsData,
        val trends: TrendData,
        val seasonality: SeasonalityData,
        val topServices: List<TopService>,
    )

    data class PredictionsData(
        val revenueForecast7Days: Double,
        val revenueForecast30Days: Double,
        val occupancyForecast7Days: Double,
        val occupancyForecast30Days: Double,
        val confidence: String,
    )

    data class TrendData(
        val revenueGrowthPercent: Double,
        val occupancyGrowthPercent: Double,
        val bookingGrowthPercent: Double,
        val trend: String,
    )

    data class SeasonalityData(
        val weekdayVsWeekend: WeekdayWeekendComparison,
        val peakMonths: List<MonthStats>,
        val peakDaysOfWeek: List<DayOfWeekStats>,
    )

    data class WeekdayWeekendComparison(
        val weekdayAvgOccupancy: Double,
        val weekendAvgOccupancy: Double,
        val difference: Double,
    )

    data class MonthStats(
        val month: String,
        val avgOccupancy: Double,
        val totalRevenue: Double,
    )

    data class DayOfWeekStats(
        val dayName: String,
        val avgOccupancy: Double,
        val avgRevenue: Double,
    )

    data class TopService(
        val serviceName: String,
        val currentWeekCount: Long,
        val improvementPercentage: Double,
    )

    fun getStats(): List<ServiceStat> {
        val today = LocalDate.now()
        val startOfDay: LocalDateTime = today.atStartOfDay()
        val endOfDay: LocalDateTime = today.atTime(LocalTime.MAX)

        val bookingsToday = scheduleRepository.countAllByOrderTimeBetween(startOfDay, endOfDay)
        val checkInsToday = reservationsRepository.countAllByCheckInIs(today)
        val guestsToday = reservationsRepository.countAllByStatus(ReservationStatus.CHECKED_IN)
        val totalRevenue =
            (reservationsRepository.sumReservationPriceByPaidIsTrue() ?: 0.0) +
                (scheduleRepository.sumPriceWhereNotNull() ?: 0.0)

        return listOf(
            ServiceStat(id = 1, name = "bookings_today", orderCount = bookingsToday),
            ServiceStat(id = 2, name = "check_ins", orderCount = checkInsToday),
            ServiceStat(id = 3, name = "revenue", revenue = String.format("%.2f", totalRevenue)),
            ServiceStat(id = 4, name = "total_guests", orderCount = guestsToday),
        )
    }

    fun getExtendedStats(): ExtendedStatsResponse {
        val predictions = calculatePredictions()
        val trends = calculateTrends()
        val seasonality = calculateSeasonality()
        val topServices = getTopServices()

        return ExtendedStatsResponse(
            predictions = predictions,
            trends = trends,
            seasonality = seasonality,
            topServices = topServices,
        )
    }

    private fun calculatePredictions(): PredictionsData {
        val today = LocalDate.now()

        val last30DaysRevenue = calculateRevenueForPeriod(today.minusDays(30), today)
        val dailyAvgRevenue = last30DaysRevenue / 30.0

        val last30DaysOccupancy = calculateAvgOccupancyForPeriod(today.minusDays(30), today)

        val revenueForecast7Days = dailyAvgRevenue * 7
        val revenueForecast30Days = dailyAvgRevenue * 30

        val trendSlope = calculateOccupancyTrend(today.minusDays(30), today)
        val occupancyForecast7Days = (last30DaysOccupancy + (trendSlope * 7)).coerceIn(0.0, 100.0)
        val occupancyForecast30Days = (last30DaysOccupancy + (trendSlope * 30)).coerceIn(0.0, 100.0)

        val dataPointsCount = countReservationsInPeriod(today.minusDays(30), today)
        val confidence =
            when {
                dataPointsCount > 50 -> "high"
                dataPointsCount > 20 -> "medium"
                else -> "low"
            }

        return PredictionsData(
            revenueForecast7Days = revenueForecast7Days,
            revenueForecast30Days = revenueForecast30Days,
            occupancyForecast7Days = occupancyForecast7Days,
            occupancyForecast30Days = occupancyForecast30Days,
            confidence = confidence,
        )
    }

    private fun calculateTrends(): TrendData {
        val today = LocalDate.now()

        val currentPeriodRevenue = calculateRevenueForPeriod(today.minusDays(30), today)
        val previousPeriodRevenue = calculateRevenueForPeriod(today.minusDays(60), today.minusDays(30))

        val revenueGrowth =
            if (previousPeriodRevenue > 1.0) {
                ((currentPeriodRevenue - previousPeriodRevenue) / previousPeriodRevenue) * 100.0
            } else if (currentPeriodRevenue > 0) {
                100.0
            } else {
                0.0
            }

        val currentOccupancy = calculateAvgOccupancyForPeriod(today.minusDays(30), today)
        val previousOccupancy = calculateAvgOccupancyForPeriod(today.minusDays(60), today.minusDays(30))
        val occupancyGrowth = currentOccupancy - previousOccupancy

        val currentBookings = countReservationsInPeriod(today.minusDays(30), today)
        val previousBookings = countReservationsInPeriod(today.minusDays(60), today.minusDays(30))

        val bookingGrowth =
            if (previousBookings > 1) {
                ((currentBookings - previousBookings).toDouble() / previousBookings) * 100.0
            } else if (currentBookings > 0) {
                100.0
            } else {
                0.0
            }

        val avgGrowth = (revenueGrowth + occupancyGrowth + bookingGrowth) / 3.0
        val trend =
            when {
                avgGrowth > 5.0 -> "rising"
                avgGrowth < -5.0 -> "declining"
                else -> "stable"
            }

        return TrendData(
            revenueGrowthPercent = revenueGrowth,
            occupancyGrowthPercent = occupancyGrowth,
            bookingGrowthPercent = bookingGrowth,
            trend = trend,
        )
    }

    private fun calculateSeasonality(): SeasonalityData {
        val today = LocalDate.now()
        val last90Days = today.minusDays(90)

        val weekdayWeekendComparison = calculateWeekdayWeekendDifference(last90Days, today)
        val dayOfWeekStats = calculateDayOfWeekStats(last90Days, today)
        val monthStats = calculateMonthlyStats(today.minusMonths(12), today)

        return SeasonalityData(
            weekdayVsWeekend = weekdayWeekendComparison,
            peakMonths = monthStats.sortedByDescending { it.avgOccupancy }.take(3),
            peakDaysOfWeek = dayOfWeekStats.sortedByDescending { it.avgOccupancy },
        )
    }

    private fun calculateRevenueForPeriod(
        startDate: LocalDate,
        endDate: LocalDate,
    ): Double {
        val reservationRevenue =
            reservationsRepository.sumReservationPriceByCheckInBetweenAndPaidIsTrue(
                startDate,
                endDate,
            ) ?: 0.0

        val serviceRevenue =
            scheduleRepository.sumPriceByOrderTimeBetween(
                startDate.atStartOfDay(),
                endDate.atTime(LocalTime.MAX),
            ) ?: 0.0

        return reservationRevenue + serviceRevenue
    }

    private fun calculateAvgOccupancyForPeriod(
        startDate: LocalDate,
        endDate: LocalDate,
    ): Double {
        val totalRooms = roomRepository.count().toDouble()
        if (totalRooms == 0.0) return 0.0

        val days = abs(ChronoUnit.DAYS.between(startDate, endDate)).toInt()
        if (days == 0) return 0.0

        val totalOccupiedRoomDays =
            repositoryExtensions.sumOccupiedRoomDaysBetween(
                startDate,
                endDate,
            )

        return (totalOccupiedRoomDays.toDouble() / (totalRooms * days)) * 100.0
    }

    private fun calculateOccupancyTrend(
        startDate: LocalDate,
        endDate: LocalDate,
    ): Double {
        val dataPoints = mutableListOf<Pair<Int, Double>>()
        var currentDate = startDate
        var dayIndex = 0

        while (!currentDate.isAfter(endDate)) {
            val occupancy = calculateAvgOccupancyForPeriod(currentDate, currentDate.plusDays(1))
            dataPoints.add(Pair(dayIndex, occupancy))
            currentDate = currentDate.plusDays(1)
            dayIndex++
        }

        if (dataPoints.isEmpty()) return 0.0

        val n = dataPoints.size
        val sumX = dataPoints.sumOf { it.first }
        val sumY = dataPoints.sumOf { it.second }
        val sumXY = dataPoints.sumOf { it.first * it.second }
        val sumX2 = dataPoints.sumOf { it.first * it.first }

        val denominator = (n * sumX2 - sumX * sumX)
        return if (denominator != 0) {
            (n * sumXY - sumX * sumY) / denominator
        } else {
            0.0
        }
    }

    private fun countReservationsInPeriod(
        startDate: LocalDate,
        endDate: LocalDate,
    ): Long =
        reservationsRepository.countAllByCreatedAtBetween(
            startDate.atStartOfDay(),
            endDate.atTime(LocalTime.MAX),
        )

    private fun calculateWeekdayWeekendDifference(
        startDate: LocalDate,
        endDate: LocalDate,
    ): WeekdayWeekendComparison {
        var weekdaySum = 0.0
        var weekendSum = 0.0
        var weekdayCount = 0
        var weekendCount = 0

        var currentDate = startDate
        while (!currentDate.isAfter(endDate)) {
            val occupancy = calculateAvgOccupancyForPeriod(currentDate, currentDate.plusDays(1))

            if (currentDate.dayOfWeek == DayOfWeek.SATURDAY || currentDate.dayOfWeek == DayOfWeek.SUNDAY) {
                weekendSum += occupancy
                weekendCount++
            } else {
                weekdaySum += occupancy
                weekdayCount++
            }

            currentDate = currentDate.plusDays(1)
        }

        val weekdayAvg = if (weekdayCount > 0) weekdaySum / weekdayCount else 0.0
        val weekendAvg = if (weekendCount > 0) weekendSum / weekendCount else 0.0

        return WeekdayWeekendComparison(
            weekdayAvgOccupancy = weekdayAvg,
            weekendAvgOccupancy = weekendAvg,
            difference = weekendAvg - weekdayAvg,
        )
    }

    private fun calculateDayOfWeekStats(
        startDate: LocalDate,
        endDate: LocalDate,
    ): List<DayOfWeekStats> {
        val dayStats = mutableMapOf<DayOfWeek, MutableList<Pair<Double, Double>>>()

        var currentDate = startDate
        while (!currentDate.isAfter(endDate)) {
            val occupancy = calculateAvgOccupancyForPeriod(currentDate, currentDate.plusDays(1))
            val revenue = calculateRevenueForPeriod(currentDate, currentDate.plusDays(1))

            dayStats
                .getOrPut(currentDate.dayOfWeek) { mutableListOf() }
                .add(Pair(occupancy, revenue))

            currentDate = currentDate.plusDays(1)
        }

        return dayStats.map { (day, values) ->
            DayOfWeekStats(
                dayName = day.toString(),
                avgOccupancy = values.map { it.first }.average(),
                avgRevenue = values.map { it.second }.average(),
            )
        }
    }

    private fun calculateMonthlyStats(
        startDate: LocalDate,
        endDate: LocalDate,
    ): List<MonthStats> {
        val monthStats = mutableMapOf<String, MutableList<Pair<Double, Double>>>()

        var currentDate = startDate
        while (!currentDate.isAfter(endDate)) {
            val monthKey = "${currentDate.year}-${currentDate.monthValue.toString().padStart(2, '0')}"
            val occupancy = calculateAvgOccupancyForPeriod(currentDate, currentDate.plusDays(1))
            val revenue = calculateRevenueForPeriod(currentDate, currentDate.plusDays(1))

            monthStats
                .getOrPut(monthKey) { mutableListOf() }
                .add(Pair(occupancy, revenue))

            currentDate = currentDate.plusDays(1)
        }

        return monthStats.map { (month, values) ->
            MonthStats(
                month = month,
                avgOccupancy = values.map { it.first }.average(),
                totalRevenue = values.sumOf { it.second },
            )
        }
    }

    private fun getTopServices(): List<TopService> {
        val today = LocalDate.now()
        val prevWeek = today.minusWeeks(1)
        val prevTwoWeeks = today.minusWeeks(2)

        val top4 = scheduleRepository.getTopServices(prevWeek.atStartOfDay(), today.atStartOfDay(), 4)

        return top4.map { current ->
            val previousCount =
                scheduleRepository.countByServiceIdAndOrderTimeBetween(
                    current.serviceId,
                    prevTwoWeeks.atStartOfDay(),
                    prevWeek.atStartOfDay(),
                )
                    ?: 0L
            val improvementPercentage = calculatePercentage(previousCount, current.count)

            TopService(
                serviceName = serviceRepository.findById(current.serviceId).get().name,
                currentWeekCount = current.count,
                improvementPercentage = improvementPercentage,
            )
        }
    }

    private fun calculatePercentage(
        previousCount: Long,
        currentCount: Long,
    ): Double =
        when {
            previousCount > 0 -> ((currentCount - previousCount).toDouble() / previousCount) * 100
            currentCount > 0 -> 100.0
            else -> 0.0
        }
}
