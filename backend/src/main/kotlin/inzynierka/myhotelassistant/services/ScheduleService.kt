package inzynierka.myhotelassistant.services

import inzynierka.myhotelassistant.controllers.schedule.ScheduleController
import inzynierka.myhotelassistant.dto.ScheduleDTO
import inzynierka.myhotelassistant.exceptions.HttpException.EntityNotFoundException
import inzynierka.myhotelassistant.exceptions.HttpException.InvalidArgumentException
import inzynierka.myhotelassistant.models.schedule.CancellationReason
import inzynierka.myhotelassistant.models.schedule.OrderStatus
import inzynierka.myhotelassistant.models.schedule.ScheduleEntity
import inzynierka.myhotelassistant.repositories.ScheduleRepository
import inzynierka.myhotelassistant.services.notifications.NotificationScheduler
import inzynierka.myhotelassistant.utils.SchedulesToDTOConverter
import org.springframework.stereotype.Service
import java.time.DayOfWeek
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.LocalTime
import java.time.format.DateTimeParseException
import java.time.temporal.TemporalAdjusters

@Service
class ScheduleService(
    private val scheduleRepository: ScheduleRepository,
    private val scheduleDateConverter: SchedulesToDTOConverter,
    private val employeeService: EmployeeService,
    private val userService: UserService,
    private val notificationScheduler: NotificationScheduler,
) {
    fun findByIdOrThrow(id: String): ScheduleEntity =
        scheduleRepository
            .findById(id)
            .orElseThrow { EntityNotFoundException("Schedule not found") }

    fun save(schedule: ScheduleEntity): ScheduleEntity = scheduleRepository.save(schedule)

    fun getTodayAvailableSchedulesByServiceId(
        serviceId: String,
        date: LocalDate,
    ): List<ScheduleEntity> {
        try {
            return scheduleRepository.findByServiceIdAndStatusAndServiceDateBetween(
                serviceId = serviceId,
                status = OrderStatus.AVAILABLE,
                startDate = date.atStartOfDay(),
                endDate = date.atTime(LocalTime.MAX),
            )
        } catch (_: DateTimeParseException) {
            throw InvalidArgumentException("Invalid date format. Expected format is ISO_ZONED_DATE_TIME.")
        }
    }

    fun weekBounds(day: LocalDate): Pair<LocalDate, LocalDate> {
        val monday = day.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY))
        val sunday = day.with(TemporalAdjusters.nextOrSame(DayOfWeek.SUNDAY))
        return monday to sunday
    }

    fun getMyWeekSchedule(
        date: LocalDate,
        username: String,
    ): List<ScheduleDTO> {
        val employeeId = employeeService.findByUsernameOrThrow(username).id!!
        return getEmployeeWeekSchedule(employeeId, date)
    }

    fun getMyTodaySchedule(username: String): List<ScheduleDTO> {
        val employeeId = employeeService.findByUsernameOrThrow(username).id!!
        val today = LocalDate.now()
        val foundSchedules =
            scheduleRepository.findByEmployeeIdAndServiceDateBetweenOrderByServiceDate(
                employeeId,
                startDate = today.atStartOfDay(),
                endDate = today.atTime(LocalTime.MAX),
            )
        return scheduleDateConverter.convertList(foundSchedules)
    }

    fun countActiveSchedulesForTheDay(
        employeeId: String,
        day: LocalDate,
    ): Long =
        scheduleRepository.countByEmployeeIdAndStatusAndServiceDateBetween(
            employeeId,
            status = OrderStatus.ACTIVE,
            startDate = day.atStartOfDay(),
            endDate = day.atTime(LocalTime.MAX),
        )

    fun countRequestedSchedules(employeeId: String): Long =
        scheduleRepository.countByEmployeeIdAndStatus(
            employeeId,
            status = OrderStatus.REQUESTED,
        )

    fun findAllActiveForOverdueNotification(now: LocalDateTime): List<ScheduleEntity> =
        scheduleRepository.findAllByStatusAndCompletionOverdueNotificationSentFalseAndServiceDateBefore(OrderStatus.ACTIVE, now)

    fun findAllRequestedForOverdueNotification(now: LocalDateTime): List<ScheduleEntity> =
        scheduleRepository.findAllByStatusAndAcceptanceOverdueNotificationSentFalseAndServiceDateBetween(
            OrderStatus.REQUESTED,
            now.minusMinutes(15),
            now.plusMinutes(15),
        )

    fun getMyPendingSchedules(username: String): List<ScheduleDTO> {
        val employeeId = employeeService.findByUsernameOrThrow(username).id!!
        val foundSchedules =
            scheduleRepository.findByEmployeeIdAndStatusInOrderByServiceDate(
                employeeId,
                statuses = listOf(OrderStatus.REQUESTED, OrderStatus.ACTIVE),
            )
        return scheduleDateConverter.convertList(foundSchedules)
    }

    fun getEmployeeWeekScheduleByUsername(
        username: String,
        date: LocalDate,
    ): List<ScheduleDTO> {
        val employeeId = employeeService.findByUsernameOrThrow(username).id!!
        return getEmployeeWeekSchedule(employeeId, date)
    }

    private fun getEmployeeWeekSchedule(
        employeeId: String,
        date: LocalDate,
    ): List<ScheduleDTO> {
        val (monday, sunday) = weekBounds(date)
        val foundSchedules =
            scheduleRepository.findByEmployeeIdAndServiceDateBetweenOrderByServiceDate(
                employeeId = employeeId,
                startDate = monday.atStartOfDay(),
                endDate = sunday.atTime(LocalTime.MAX),
            )
        return scheduleDateConverter.convertList(foundSchedules)
    }

    fun changeScheduleStatus(
        scheduleId: String,
        newScheduleStatus: OrderStatus,
        reason: String? = null,
    ): ScheduleDTO {
        val schedule = findByIdOrThrow(scheduleId)
        val oldStatus = schedule.status
        reason?.let { schedule.cancellationReason = CancellationReason.fromString(it) }
        schedule.status = newScheduleStatus
        save(schedule)

        notificationScheduler.notifyGuestOnStatusChange(schedule, oldStatus, newScheduleStatus)
        if (newScheduleStatus == OrderStatus.CANCELED || newScheduleStatus == OrderStatus.COMPLETED) {
            val guest = userService.findByIdOrThrow(schedule.guestId!!)
            guest.guestData?.removeElementFromBill(scheduleId)
        }

        return scheduleDateConverter.convert(schedule)
    }

    fun findByGuestId(guestId: String): List<ScheduleEntity> = scheduleRepository.findByGuestId(guestId)

    fun getSchedulesForTransactionsHistory(scheduleIds: List<String>): List<ScheduleController.ScheduleForTransactionsHistory> {
        val schedules = scheduleRepository.findAllById(scheduleIds)
        return schedules.map { scheduleDateConverter.convertForTransactionsHistory(it) }
    }
}
