package inzynierka.myhotelassistant.controllers.schedule
import inzynierka.myhotelassistant.dto.ScheduleDTO
import inzynierka.myhotelassistant.exceptions.HttpException.InvalidArgumentException
import inzynierka.myhotelassistant.models.schedule.OrderStatus
import inzynierka.myhotelassistant.services.EmployeeService
import inzynierka.myhotelassistant.services.ScheduleService
import inzynierka.myhotelassistant.services.ServiceService
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PatchMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController
import java.security.Principal
import java.time.DayOfWeek
import java.time.LocalDateTime
import java.time.ZonedDateTime
import java.time.format.DateTimeParseException

@RestController
@RequestMapping("/schedule")
class ScheduleController(
    private val scheduleService: ScheduleService,
    private val employeeService: EmployeeService,
    private val serviceService: ServiceService,
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
    ): List<ScheduleForWeekResponse> =
        scheduleService
            .findScheduleForCurrentWeekById(id, date)
            .map { schedule ->
                val empId = schedule.employeeId
                val emp = employeeService.findByIdOrThrow(empId)
                ScheduleForWeekResponse(
                    schedule.id ?: "",
                    "${emp.name} ${emp.surname}",
                    schedule.serviceDate,
                    schedule.weekday,
                    schedule.status != OrderStatus.AVAILABLE,
                    schedule.status,
                )
            }

    @GetMapping("/get/cart/id/{id}")
    @ResponseStatus(HttpStatus.OK)
    fun getScheduleForCartById(
        @PathVariable id: String,
    ): ScheduleForCartResponse? {
        val scheduleItem = scheduleService.findById(id)
        if (scheduleItem?.employeeId == null) return null
        val assignedEmployee = employeeService.findByIdOrThrow(scheduleItem.employeeId)
        val serviceOpt = serviceService.findById(scheduleItem.serviceId)
        if (!serviceOpt.isPresent) {
            return null
        }
        val service = serviceOpt.get()
        return ScheduleForCartResponse(
            id,
            service.name,
            scheduleItem.employeeId,
            assignedEmployee.name + " " + assignedEmployee.surname,
            service.image ?: "",
            service.price,
            scheduleItem.serviceDate,
        )
    }

    @GetMapping(params = ["date"])
    @ResponseStatus(HttpStatus.OK)
    fun getWholeWeekSchedule(
        @RequestParam date: String,
        principal: Principal,
    ): List<ScheduleDTO> {
        try {
            val parsedDate = ZonedDateTime.parse(date).toLocalDate()
            return scheduleService.getMyWeekSchedule(parsedDate, principal.name)
        } catch (_: DateTimeParseException) {
            throw InvalidArgumentException("Invalid date format. Expected format is ISO_ZONED_DATE_TIME.")
        }
    }

    @PatchMapping("/{scheduleId}/confirm")
    @ResponseStatus(HttpStatus.OK)
    fun confirmRequestedSchedule(
        @PathVariable scheduleId: String,
    ): ScheduleDTO = scheduleService.changeScheduleStatus(scheduleId, OrderStatus.ACTIVE)

    @PatchMapping("/{scheduleId}/reject")
    @ResponseStatus(HttpStatus.OK)
    fun rejectRequestedSchedule(
        @PathVariable scheduleId: String,
        @RequestParam reason: String,
    ): ScheduleDTO = scheduleService.changeScheduleStatus(scheduleId, OrderStatus.CANCELED, reason)

    @PatchMapping("/{scheduleId}/complete")
    @ResponseStatus(HttpStatus.OK)
    fun completeActiveSchedule(
        @PathVariable scheduleId: String,
    ): ScheduleDTO = scheduleService.changeScheduleStatus(scheduleId, OrderStatus.COMPLETED)

    @PatchMapping("/{scheduleId}/cancel")
    @ResponseStatus(HttpStatus.OK)
    fun cancelActiveSchedule(
        @PathVariable scheduleId: String,
        @RequestParam reason: String,
    ): ScheduleDTO = scheduleService.changeScheduleStatus(scheduleId, OrderStatus.CANCELED, reason)
}
