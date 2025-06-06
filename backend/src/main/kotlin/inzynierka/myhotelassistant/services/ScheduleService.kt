package inzynierka.myhotelassistant.services

import inzynierka.myhotelassistant.exceptions.HttpException.EntityNotFoundException
import inzynierka.myhotelassistant.exceptions.HttpException.InvalidArgumentException
import inzynierka.myhotelassistant.models.schedule.OrderStatus
import inzynierka.myhotelassistant.models.schedule.ScheduleEntity
import inzynierka.myhotelassistant.models.user.UserEntity
import inzynierka.myhotelassistant.repositories.ScheduleRepository
import org.springframework.stereotype.Service
import java.time.DayOfWeek
import java.time.Instant
import java.time.LocalDate
import java.time.OffsetDateTime
import java.time.format.DateTimeParseException
import java.time.temporal.TemporalAdjusters

@Service
class ScheduleService(
    private val scheduleRepository: ScheduleRepository,
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
            println("Parsing date: $date")
            parsedDate =
                Instant
                    .parse(date)
                    .atOffset(OffsetDateTime.now().offset)
                    .toLocalDate()
            println("Parsed date: $parsedDate")
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

    fun findAllPendingByGuestId(guestId: String): List<ScheduleEntity> {
        val status = listOf(OrderStatus.PENDING, OrderStatus.IN_PROGRESS)
        return scheduleRepository.findByGuestIdAndStatusIsIn(guestId, status)
    }

    fun reserveSchedulesForUser(
        user: UserEntity,
        scheduleIds: List<String>,
    ) {
        val schedules = scheduleRepository.findAllById(scheduleIds)
        schedules.map { schedule ->
            {
                if (schedule.isOrdered) throw InvalidArgumentException("Schedule is already reserved.")
                schedule.employeeId = user.id
                schedule.isOrdered = true
                schedule.orderTime = LocalDate.now().atStartOfDay()
                schedule.status = OrderStatus.IN_PROGRESS
            }
        }
        scheduleRepository.saveAll(schedules)
    }
}
