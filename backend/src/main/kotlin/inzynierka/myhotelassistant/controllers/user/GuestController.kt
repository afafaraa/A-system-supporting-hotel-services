package inzynierka.myhotelassistant.controllers.user

import inzynierka.myhotelassistant.services.ScheduleService
import inzynierka.myhotelassistant.services.UserService
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController

@RestController()
@RequestMapping("/guest")
class GuestController(
    private val userService: UserService,
    private val scheduleService: ScheduleService,
) {
    data class EmployeeNameResponse(
        val name: String,
        val surname: String,
    )

    @GetMapping("/employee/get/id/{id}")
    @ResponseStatus(HttpStatus.OK)
    fun getScheduledEmployeeNameById(
        @PathVariable id: String,
    ): EmployeeNameResponse? {
        val user = userService.findById(id)
        if (user != null) {
            return EmployeeNameResponse(name = user.name, surname = user.surname)
        }
        return null
    }
}
