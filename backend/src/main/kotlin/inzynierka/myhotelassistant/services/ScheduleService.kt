package inzynierka.myhotelassistant.services

import inzynierka.myhotelassistant.dto.ScheduleDTO
import inzynierka.myhotelassistant.exceptions.HttpException.EntityNotFoundException
import inzynierka.myhotelassistant.exceptions.HttpException.InvalidArgumentException
import inzynierka.myhotelassistant.models.schedule.ScheduleEntity
import inzynierka.myhotelassistant.repositories.ScheduleRepository
import inzynierka.myhotelassistant.utils.SchedulesToDTOConverter
import org.springframework.stereotype.Service
import java.time.DayOfWeek
import java.time.LocalDate
import java.time.LocalTime
import java.time.format.DateTimeFormatter
import java.time.format.DateTimeParseException
import java.time.temporal.TemporalAdjusters

@Service
class ScheduleService(
    private val scheduleRepository: ScheduleRepository,
    private val scheduleDateConverter: SchedulesToDTOConverter,
    private val employeeService: EmployeeService,
) {
    fun findAll(): List<ScheduleEntity> = scheduleRepository.findAll()

    fun findByIdOrThrow(id: String): ScheduleEntity =
        scheduleRepository
            .findById(id)
            .orElseThrow { EntityNotFoundException("Schedule not found") }

    fun findById(id: String): ScheduleEntity? {
        val it = scheduleRepository.findById(id)
        if (it.isPresent) return it.get()
        return null
    }

    fun save(schedule: ScheduleEntity): ScheduleEntity = scheduleRepository.save(schedule)

    fun findScheduleForCurrentWeekById(
        id: String,
        date: String,
    ): List<ScheduleEntity> {
        val parsedDate: LocalDate
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
            scheduleRepository.findByEmployeeIdAndServiceDateBetween(
                employeeId = employeeId,
                startDate = monday.atStartOfDay(),
                endDate = sunday.atTime(LocalTime.MAX),
            )
        if (foundSchedules.isEmpty()) {
            throw EntityNotFoundException("No available schedules found in the specified week")
        }
        return scheduleDateConverter.convert(foundSchedules)
    }
}
