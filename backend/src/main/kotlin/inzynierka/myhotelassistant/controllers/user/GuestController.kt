package inzynierka.myhotelassistant.controllers.user

import inzynierka.myhotelassistant.services.ScheduleService
import inzynierka.myhotelassistant.services.UserService
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
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

    @PostMapping("/order/add/{scheduleId}/{username}")
    @ResponseStatus(HttpStatus.OK)
    fun addNewOrderFromScheduled(
        @PathVariable scheduleId: String,
        @PathVariable username: String,
    ) {
        println(scheduleId)
        println(username)
        val user = userService.findByUsername(username)
        println(user)
        if (user != null) {
            val schedule = scheduleService.findById(scheduleId)
            if (schedule != null) {
//                user.guestData?.orders?.add(
//                    OrderEntity(scheduleId = scheduleId, orderDate = Instant.now(), orderForDate = schedule.serviceDate),
//                )
            }
        }
    }

//    @GetMapping("/order/get/all/pending/{username}")
//    @ResponseStatus(HttpStatus.OK)
//    fun getAllPendingOrdersForUser(
//        @PathVariable username: String,
//    ): List<OrderEntity>? {
//        val user = userService.findByUsername(username)
//        if (user != null) {
//            val orders = user.guestData?.orders?.filter { it.status == OrderStatus.PENDING || it.status == OrderStatus.IN_PROGRESS }
//            return orders
//        }
//        return null
//    }
}
