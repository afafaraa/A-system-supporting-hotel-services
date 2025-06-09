package inzynierka.myhotelassistant.controllers.schedule
import inzynierka.myhotelassistant.dto.ScheduleData
import inzynierka.myhotelassistant.dto.ShiftData
import inzynierka.myhotelassistant.exceptions.HttpException.InvalidArgumentException
import inzynierka.myhotelassistant.models.schedule.OrderStatus
import inzynierka.myhotelassistant.services.EmployeeService
import inzynierka.myhotelassistant.services.ScheduleService
import inzynierka.myhotelassistant.services.ServiceService
import inzynierka.myhotelassistant.services.UserService
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController
import java.time.DayOfWeek
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.ZonedDateTime
import java.time.format.DateTimeFormatter
import java.time.format.DateTimeParseException

@RestController
@RequestMapping("/schedule")
class ScheduleController(
    private val scheduleService: ScheduleService,
    private val employeeService: EmployeeService,
    private val serviceService: ServiceService,
    private val userService: UserService,
) {
    data class ScheduleForCartResponse(
        val id: String,
        val name: String,
        val employeeId: String,
        val employeeFullName: String,
        val imageUrl: String,
        val price: Double,
        val datetime: LocalDateTime,
    )

    data class ScheduleForWeekResponse(
        val id: String,
        val employeeFullName: String?,
        val serviceDate: LocalDateTime,
        val weekday: DayOfWeek,
        val isOrdered: Boolean,
        val status: OrderStatus,
    )

    @GetMapping("/get/week/id/{id}")
    @ResponseStatus(HttpStatus.OK)
    fun getScheduleByServiceIdForWeek(
        @PathVariable id: String,
        @RequestParam date: String,
    ): List<ScheduleForWeekResponse> {
        return scheduleService
            .findScheduleForCurrentWeekById(id, date)
            .mapNotNull { schedule ->
                val empId = schedule.employeeId ?: return@mapNotNull null
                val emp = employeeService.findByIdOrThrow(empId)
                ScheduleForWeekResponse(
                    schedule.id ?: "",
                    "${emp.name} ${emp.surname}",
                    schedule.serviceDate,
                    schedule.weekday,
                    schedule.isOrdered,
                    schedule.status,
                )
            }
    }

    @GetMapping("/get/cart/id/{id}")
    @ResponseStatus(HttpStatus.OK)
    fun getScheduleForCartById(
        @PathVariable id: String,
    ): ScheduleForCartResponse? {
        val scheduleItem = scheduleService.findById(id)
        if (scheduleItem?.employeeId == null) return null
        val assignedEmployee = employeeService.findByIdOrThrow(scheduleItem.employeeId!!)
        val serviceOpt = serviceService.findById(scheduleItem.serviceId)
        if (!serviceOpt.isPresent) {
            return null
        }
        val service = serviceOpt.get()
        return ScheduleForCartResponse(
            id,
            service.name,
            scheduleItem.employeeId!!,
            assignedEmployee.name + " " + assignedEmployee.surname,
            service.image ?: "",
            service.price,
            scheduleItem.serviceDate,
        )
    }

    @GetMapping("/available/week-schedule")
    @ResponseStatus(HttpStatus.OK)
    fun getAvailableWeekSchedule(
        @RequestParam date: String,
    ): ScheduleData {
        try {
            val parsedDate = ZonedDateTime.parse(date).toLocalDate()
            return scheduleService.getAvailableWeekSchedule(parsedDate)
        } catch (_: DateTimeParseException) {
            throw InvalidArgumentException("Invalid date format. Expected format is ISO_ZONED_DATE_TIME.")
        }
    }

    @GetMapping("/get/week/employee/{username}")
    @ResponseStatus(HttpStatus.OK)
    fun getEmployeeScheduleForWeek(
        @PathVariable username: String,
        @RequestParam date: String,
    ): List<ShiftData> {
        val parsedDate =
            try {
                LocalDate.parse(date, DateTimeFormatter.ofPattern("yyyy-MM-dd"))
            } catch (e: DateTimeParseException) {
                throw InvalidArgumentException("Invalid date format. Expected format is 'yyyy-MM-dd'.")
            }

        val employee = employeeService.findByUsernameOrThrow(username)
        val (monday, sunday) = scheduleService.weekBounds(parsedDate)

        val schedules =
            scheduleService.findByEmployeeIdAndDateRange(
                employee.id!!,
                monday.atStartOfDay(),
                sunday.atTime(23, 59, 59),
            )

        return schedules.map {
            val serviceName = serviceService.findById(it.serviceId).orElse(null)?.name ?: "Unknown"
            val guestUsername =
                it.guestId?.let { gid ->
                    userService.findById(gid)?.username
                } ?: "N/A"

            ShiftData(
                id = it.id!!,
                weekday = it.weekday,
                startHour = it.serviceDate.hour,
                endHour = it.serviceDate.hour + 2,
                title = serviceName,
                guest = guestUsername,
                status = it.status,
                serviceId = it.serviceId,
            )
        }
    }
}
