package inzynierka.myhotelassistant.controllers.schedule
import inzynierka.myhotelassistant.models.schedule.ScheduleEntity
import inzynierka.myhotelassistant.services.EmployeeService
import inzynierka.myhotelassistant.services.ScheduleService
import inzynierka.myhotelassistant.services.ServiceService
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController
import java.time.Instant

@RestController
@RequestMapping("/schedule")
class ScheduleController(private val scheduleService: ScheduleService, private val employeeService: EmployeeService, private val serviceService: ServiceService) {

    data class ScheduleForCartResponse(val id: String, val name: String, val employeeId: String, val employeeFullName: String, val imageUrl: String, val price: Double, val datetime: Instant);
    @GetMapping("/get/week/id/{id}")
    @ResponseStatus(HttpStatus.OK)
    fun getScheduleByServiceIdForWeek(@PathVariable id: String, @RequestParam date: String): List<ScheduleEntity?> {
        return scheduleService.findScheduleForCurrentWeekById(id, Instant.parse(date))
    }

    @GetMapping("/get/cart/id/{id}")
    @ResponseStatus(HttpStatus.OK)
    fun getScheduleForCartById(@PathVariable id: String): ScheduleForCartResponse? {
        val scheduleItem = scheduleService.findById(id)
        if (scheduleItem == null) {
            return null
        }
        val assignedEmployee = employeeService.findById(scheduleItem.employeeId)
        if (assignedEmployee == null) {
            return null
        }
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
            scheduleItem.serviceDate)
    }
}