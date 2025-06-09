package inzynierka.myhotelassistant.services

import inzynierka.myhotelassistant.dto.ScheduleData
import inzynierka.myhotelassistant.exceptions.HttpException.EntityNotFoundException
import inzynierka.myhotelassistant.exceptions.HttpException.InvalidArgumentException
import inzynierka.myhotelassistant.models.schedule.ScheduleEntity
import inzynierka.myhotelassistant.repositories.ScheduleRepository
import inzynierka.myhotelassistant.utils.SchedulesToScheduleDataConverter
import org.springframework.stereotype.Service
import java.time.DayOfWeek
import java.time.LocalDate
import java.time.format.DateTimeFormatter
import java.time.format.DateTimeParseException
import java.time.temporal.TemporalAdjusters

@Service
class ScheduleService(
    private val scheduleRepository: ScheduleRepository,
    private val scheduleDateConverter: SchedulesToScheduleDataConverter,
) {
    fun findByIdOrThrow(id: String): ScheduleEntity =
        scheduleRepository
            .findById(id)
            .orElseThrow { EntityNotFoundException("Schedule not found") }

    fun findScheduleForCurrentWeekById(
        id: String,
        date: String,
    ): List<ScheduleEntity> {
        var parsedDate: LocalDate
        try {
            parsedDate = LocalDate.parse(date, DateTimeFormatter.ofPattern("yyyy-MM-dd"))
        } catch (_: DateTimeParseException) {
            throw InvalidArgumentException("Invalid date format. Expected format is 'yyyy-MM-dd'.")
        }

        val (monday, sunday) = weekBounds(parsedDate)

        return scheduleRepository.findByServiceIdAndServiceDateBetween(
            serviceId = id,
            startDate = monday.atStartOfDay(),
            endDate = sunday.atTime(23, 59, 59),
        )
    }

    private fun weekBounds(day: LocalDate): Pair<LocalDate, LocalDate> {
        val monday = day.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY))
        val sunday = day.with(TemporalAdjusters.nextOrSame(DayOfWeek.SUNDAY))
        return monday to sunday
    }

    fun getAvailableWeekSchedule(date: LocalDate): ScheduleData {
        val (monday, sunday) = weekBounds(date)
        val foundSchedules =
            scheduleRepository.findByIsOrderedAndServiceDateBetween(
                isOrdered = false,
                startDate = monday.atStartOfDay(),
                endDate = sunday.atTime(23, 59, 59),
            )
        if (foundSchedules.isEmpty()) {
            throw EntityNotFoundException("No available schedules found in the specified week")
        }
        return scheduleDateConverter.convert(foundSchedules, date)
    }
}
