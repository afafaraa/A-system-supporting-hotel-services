package inzynierka.myhotelassistant.controllers.user

import inzynierka.myhotelassistant.models.schedule.ScheduleEntity
import inzynierka.myhotelassistant.services.ScheduleService
import inzynierka.myhotelassistant.services.UserService
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
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

    @GetMapping("/order/get/all/pending/{username}")
    @ResponseStatus(HttpStatus.OK)
    fun getAllPendingOrdersForUser(
        @PathVariable username: String,
    ): List<ScheduleEntity>? {
        val user = userService.findByUsernameOrThrow(username)
        return scheduleService.findAllPendingByGuestId(user.id!!)
    }

    class OrderRequest(
        val username: String,
        val scheduleIds: List<String>,
    )

    @PostMapping("/order")
    @ResponseStatus(HttpStatus.OK)
    fun addNewOrderFromScheduled(
        @RequestBody orderRequest: OrderRequest,
    ) {
        val user = userService.findByUsernameOrThrow(orderRequest.username)
        scheduleService.reserveSchedulesForUser(user, orderRequest.scheduleIds)
    }
}
