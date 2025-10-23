package inzynierka.myhotelassistant.controllers.user

import inzynierka.myhotelassistant.controllers.ReservationsController
import inzynierka.myhotelassistant.exceptions.HttpException
import inzynierka.myhotelassistant.models.reservation.ReservationEntity
import inzynierka.myhotelassistant.models.schedule.OrderStatus
import inzynierka.myhotelassistant.models.service.ReservationsService
import inzynierka.myhotelassistant.models.user.UserEntity
import inzynierka.myhotelassistant.repositories.UserRepository
import inzynierka.myhotelassistant.services.OrderService
import inzynierka.myhotelassistant.services.ScheduleService
import inzynierka.myhotelassistant.services.ServiceService
import inzynierka.myhotelassistant.services.UserService
import inzynierka.myhotelassistant.services.notifications.NotificationScheduler
import org.springframework.data.domain.PageRequest
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController
import java.time.LocalDateTime

@RestController
@RequestMapping("/guest")
class GuestController(
    private val userService: UserService,
    private val scheduleService: ScheduleService,
    private val serviceService: ServiceService,
    private val orderService: OrderService,
    private val reservationsService: ReservationsService,
    private val notificationScheduler: NotificationScheduler,
) {
    data class EmployeeNameResponse(
        val name: String,
        val surname: String,
    )

    data class OrderServicesRequestBody(
        val id: String,
        val username: String,
    )

    data class OrderServicesBatchRequest(
        val ids: List<String>,
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
        val user = userService.findById(id) ?: throw HttpException.EntityNotFoundException("User not found")
        return EmployeeNameResponse(name = user.name, surname = user.surname)
    }

    @PostMapping("/order/cancel")
    @ResponseStatus(HttpStatus.OK)
    fun cancelOrderByGuest(
        @RequestBody req: CancelOrderRequest,
    ) {
        val user = userService.findByUsernameOrThrow(req.username)
        orderService.cancel(user, req.orderId)
    }

    @PostMapping("/order/services")
    @ResponseStatus(HttpStatus.CREATED)
    fun orderServicesFromSchedule(
        @RequestBody req: OrderServicesRequestBody,
    ) {
        val guest = userService.findByUsernameOrThrow(req.username)
        val schedule = orderService.order(guest, req.id)
        notificationScheduler.notifyGuestOnSuccessfulOrder(schedule)
    }

    @PostMapping("/order/services/add-to-tab")
    @ResponseStatus(HttpStatus.OK)
    fun addServicesToTab(
        @RequestBody req: OrderServicesBatchRequest,
    ) {
        val guest = userService.findByUsernameOrThrow(req.username)
        req.ids.forEach { scheduleId ->
            orderService.order(guest, scheduleId)
        }
    }

    @PostMapping("/reservation/add-to-tab")
    @ResponseStatus(HttpStatus.CREATED)
    fun addReservationToTab(
        @RequestBody req: ReservationsController.ReservationCreateDTO,
    ) {
        try {
            val reservation: ReservationEntity = reservationsService.createReservation(req)
            val guest = userService.findByUsernameOrThrow(req.guestUsername)
            guest.guestData?.let { data ->
                data.bill += reservation.reservationPrice
            }
            userService.save(guest)
        } catch (e: IllegalArgumentException) {
            throw HttpException.InvalidArgumentException(e.message ?: "Invalid reservation data")
        }
    }

    @GetMapping("/order/get/all/requested/{username}")
    @ResponseStatus(HttpStatus.OK)
    fun getAllPendingOrdersForUser(
        @PathVariable username: String,
    ): List<ScheduleForPastAndRequestedServicesResponse> {
        val userId = userService.findByUsernameOrThrow(username).id!!
        return findAllByStatusAndUserId(listOf(OrderStatus.REQUESTED, OrderStatus.ACTIVE), userId)
    }

    @GetMapping("/order/get/all/past/{username}")
    @ResponseStatus(HttpStatus.OK)
    fun getAllPastOrdersForUser(
        @PathVariable username: String,
    ): List<ScheduleForPastAndRequestedServicesResponse> {
        val userId = userService.findByUsernameOrThrow(username).id!!
        return findAllByStatusAndUserId(listOf(OrderStatus.COMPLETED, OrderStatus.CANCELED), userId)
    }

    @GetMapping("/order/get/all/{username}")
    @ResponseStatus(HttpStatus.OK)
    fun getAllOrdersForUser(
        @PathVariable username: String,
    ): List<ScheduleForPastAndRequestedServicesResponse> {
        val userId = userService.findByUsernameOrThrow(username).id!!
        return findAllByStatusAndUserId(
            listOf(OrderStatus.REQUESTED, OrderStatus.ACTIVE, OrderStatus.COMPLETED, OrderStatus.CANCELED),
            userId,
        )
    }

    @GetMapping("/bill/get/{username}")
    @ResponseStatus(HttpStatus.OK)
    fun getBill(
        @PathVariable username: String,
    ): Double {
        val guest = userService.findByUsernameOrThrow(username)
        return guest.guestData?.bill ?: 0.0
    }

    @GetMapping("/management")
    @ResponseStatus(HttpStatus.OK)
    fun getAllGuests(
        @RequestParam(defaultValue = "0") page: Int,
        @RequestParam(defaultValue = "10") size: Int,
    ): List<UserEntity> {
        val pageable = PageRequest.of(page, size)
        return userService.getAllGuests(pageable)
    }

    private fun findAllByStatusAndUserId(
        statusList: List<OrderStatus>,
        userId: String,
    ): List<ScheduleForPastAndRequestedServicesResponse> {
        return scheduleService
            .findByGuestIdAndStatusIn(userId, statusList)
            .mapNotNull { scheduleItem ->
                val assignedEmployee = userService.findById(scheduleItem.employeeId)
                val serviceOpt = serviceService.findById(scheduleItem.serviceId)

                if (assignedEmployee == null || serviceOpt.isEmpty) {
                    null
                } else {
                    val service = serviceOpt.get()
                    scheduleItem.id?.let {
                        ScheduleForPastAndRequestedServicesResponse(
                            it,
                            service.name,
                            scheduleItem.employeeId,
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
