package inzynierka.myhotelassistant.controllers.user

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

    data class AddToBillRequest(
        val amount: Double,
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
    fun cancelOrderByGuest(
        @RequestBody req: CancelOrderRequest,
    ) {
        val user = userService.findByUsernameOrThrow(req.username)
        val scheduledService = scheduleService.findByIdOrThrow(req.orderId)
        val service = serviceService.findByIdOrThrow(scheduledService.serviceId)

        if (user.id != scheduledService.guestId) {
            throw HttpException.NoPermissionException("You are not allowed to cancel order for other guests")
        }

        val now = LocalDateTime.now()
        val serviceDate = scheduledService.serviceDate

        if (Duration.between(now, serviceDate).toHours() < 1) {
            throw HttpException.NoPermissionException("Cannot cancel the order less than 24 hours before the service")
        }

        scheduledService.isOrdered = false
        scheduledService.guestId = null
        scheduledService.status = OrderStatus.AVAILABLE
        user.guestData?.let { data ->
            data.bill -= service.price
        }
        scheduleService.save(scheduledService)
        userService.save(user)
    }

    @PostMapping("/order/services")
    @ResponseStatus(HttpStatus.CREATED)
    fun orderServicesFromSchedule(
        @RequestBody req: OrderServicesRequestBody,
    ) {
        val schedule = scheduleService.findByIdOrThrow(req.id)
        val guest = userService.findByUsernameOrThrow(req.username)
        val service = serviceService.findByIdOrThrow(schedule.serviceId)
        schedule.isOrdered = true
        schedule.guestId = guest.id
        schedule.status = OrderStatus.REQUESTED
        guest.guestData?.let { data ->
            data.bill += service.price
        }
        scheduleService.save(schedule)
        userService.save(guest)
    }

    @GetMapping("/order/get/all/requested/{username}")
    @ResponseStatus(HttpStatus.OK)
    fun getAllPendingOrdersForUser(
        @PathVariable username: String,
    ): List<ScheduleForPastAndRequestedServicesResponse>? {
        val userId = userService.findByUsernameOrThrow(username).id
        if (userId != null) {
            return findAllByStatusAndUserId(listOf(OrderStatus.REQUESTED, OrderStatus.ACTIVE), userId)
        }
        return null
    }

    @GetMapping("/order/get/all/past/{username}")
    @ResponseStatus(HttpStatus.OK)
    fun getAllPastOrdersForUser(
        @PathVariable username: String,
    ): List<ScheduleForPastAndRequestedServicesResponse>? {
        val userId = userService.findByUsernameOrThrow(username).id
        if (userId != null) {
            return findAllByStatusAndUserId(listOf(OrderStatus.COMPLETED, OrderStatus.CANCELED), userId)
        }
        return null
    }

    @GetMapping("/bill/get/{username}")
    @ResponseStatus(HttpStatus.OK)
    fun getBill(
        @PathVariable username: String,
    ): Double {
        val guest = userService.findByUsernameOrThrow(username)
        return guest.guestData?.bill ?: 0.0
    }

    private fun findAllByStatusAndUserId(
        statusList: List<OrderStatus>,
        userId: String,
    ): List<ScheduleForPastAndRequestedServicesResponse> =
        scheduleService
            .findAll()
            .filter { statusList.contains(it.status) && it.guestId == userId }
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
