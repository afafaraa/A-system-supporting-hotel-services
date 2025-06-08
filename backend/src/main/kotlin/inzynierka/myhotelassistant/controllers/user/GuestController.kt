package inzynierka.myhotelassistant.controllers.user

import inzynierka.myhotelassistant.controllers.schedule.ScheduleController.ScheduleForCartResponse
import inzynierka.myhotelassistant.exceptions.HttpException
import inzynierka.myhotelassistant.models.schedule.OrderStatus
import inzynierka.myhotelassistant.services.ScheduleService
import inzynierka.myhotelassistant.services.ServiceService
import inzynierka.myhotelassistant.services.UserService
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController
import java.time.Duration
import java.time.LocalDateTime

@RestController()
@RequestMapping("/guest")
class GuestController(
    private val userService: UserService,
    private val scheduleService: ScheduleService,
    private val serviceService: ServiceService,
) {
    data class EmployeeNameResponse(
        val name: String,
        val surname: String,
    )

    data class OrderServicesRequestBody(
        val id: String,
        val username: String,
    )

    data class ScheduleForPastAndRequestedServicesResponse(
        val id: String,
        val name: String,
        val employeeId: String,
        val employeeFullName: String,
        val imageUrl: String,
        val price: Double,
        val datetime: LocalDateTime,
        val status: OrderStatus,
    )

    data class CancelOrderRequest(
        val orderId: String,
        val username: String,
    )


    @GetMapping("/employee/get/id/{id}")
    @ResponseStatus(HttpStatus.OK)
    fun getScheduledEmployeeNameById(
        @PathVariable id: String,
    ): EmployeeNameResponse? {
        val user = userService.findById(id)
        if (user == null) {
            throw HttpException.EntityNotFoundException("User not found")
        }
        return EmployeeNameResponse(name = user.name, surname = user.surname)
    }

    @PostMapping("/order/cancel")
    @ResponseStatus(HttpStatus.OK)
    fun cancelOrderByGuest(@RequestBody req: CancelOrderRequest) {
        val user = userService.findByUsernameOrThrow(req.username)
        val scheduledService = scheduleService.findByIdOrThrow(req.orderId)

        if (user.id != scheduledService.guestId) {
            throw HttpException.NoPermissionException("You are not allowed to cancel order for other guests")
        }

        val now = LocalDateTime.now()
        val serviceDate = scheduledService.serviceDate

        if (Duration.between(now, serviceDate).toHours() < 24) {
            throw HttpException.NoPermissionException("Cannot cancel the order less than 24 hours before the service")
        }

        scheduledService.isOrdered = false
        scheduledService.guestId = null
        scheduledService.status = OrderStatus.AVAILABLE
        scheduleService.save(scheduledService)
    }


    @PostMapping("/order/services")
    @ResponseStatus(HttpStatus.CREATED)
    fun orderServicesFromSchedule(
        @RequestBody req: OrderServicesRequestBody,
    ) {
        val schedule = scheduleService.findById(req.id)
        schedule?.isOrdered = true
        schedule?.guestId = userService.findByUsernameOrThrow(req.username).id
        schedule?.status = OrderStatus.PENDING
        scheduleService.save(schedule!!)
    }

    @GetMapping("/order/get/all/requested/{username}")
    @ResponseStatus(HttpStatus.OK)
    fun getAllPendingOrdersForUser(@PathVariable username: String): List<ScheduleForPastAndRequestedServicesResponse>? {
        val userId = userService.findByUsernameOrThrow(username).id
        if (userId != null) {
            return findAllByStatusAndUserId(listOf(OrderStatus.PENDING, OrderStatus.IN_PROGRESS), userId)
        }
        return null
    }

    @GetMapping("/order/get/all/past/{username}")
    @ResponseStatus(HttpStatus.OK)
    fun getAllPastOrdersForUser(@PathVariable username: String): List<ScheduleForPastAndRequestedServicesResponse>? {
        val userId = userService.findByUsernameOrThrow(username).id
        if (userId != null) {
            return findAllByStatusAndUserId(listOf(OrderStatus.FINISHED, OrderStatus.CANCELED), userId)
        }
        return null
    }

    private fun findAllByStatusAndUserId(statusList: List<OrderStatus>, userId: String): List<ScheduleForPastAndRequestedServicesResponse> {
        return scheduleService.findAll()
            .filter { statusList.contains(it.status) && it.guestId == userId}
            .mapNotNull { scheduleItem ->
                val assignedEmployee = scheduleItem.employeeId?.let { userService.findById(it) }
                val serviceOpt = scheduleItem.serviceId?.let { serviceService.findById(it) }

                if (assignedEmployee == null || serviceOpt == null || serviceOpt.isEmpty) {
                    null
                } else {
                    val service = serviceOpt.get()
                    scheduleItem.id?.let {
                        ScheduleForPastAndRequestedServicesResponse(
                            it,
                            service.name,
                            scheduleItem.employeeId!!,
                            assignedEmployee.name + " " + assignedEmployee.surname,
                            service.image ?: "",
                            service.price,
                            scheduleItem.serviceDate,
                            scheduleItem.status,
                        )
                    }
                }
            }
    }


}
