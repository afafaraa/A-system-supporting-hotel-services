package inzynierka.myhotelassistant.controllers.user

import inzynierka.myhotelassistant.controllers.ReservationsController
import inzynierka.myhotelassistant.dto.OrderRequest
import inzynierka.myhotelassistant.models.schedule.OrderStatus
import inzynierka.myhotelassistant.models.service.ReservationsService
import inzynierka.myhotelassistant.models.user.UserEntity
import inzynierka.myhotelassistant.services.OrderService
import inzynierka.myhotelassistant.services.ScheduleService
import inzynierka.myhotelassistant.services.ServiceService
import inzynierka.myhotelassistant.services.UserService
import inzynierka.myhotelassistant.services.notifications.NotificationScheduler
import org.springframework.data.domain.PageRequest
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController
import java.security.Principal
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
    data class CancelOrderRequest(
        val orderId: String,
        val username: String,
    )

    @PostMapping("/order/cancel")
    @ResponseStatus(HttpStatus.OK)
    fun cancelOrderByGuest(
        @RequestBody req: CancelOrderRequest,
    ) {
        val user = userService.findByUsernameOrThrow(req.username)
        orderService.cancel(user, req.orderId)
    }

    @PostMapping("/order/add-to-tab")
    fun addServicesAndReservationsToTab(
        principal: Principal,
        @RequestBody req: OrderRequest,
    ) {
        val guest = userService.findByUsernameOrThrow(principal.name)

        req.schedules.forEach { (scheduleId, specialRequests) ->
            val schedule = orderService.order(guest, scheduleId, specialRequests)
            notificationScheduler.notifyGuestOnSuccessfulOrder(schedule)
        }

        req.reservations.forEach { reservation ->
            val reservation =
                reservationsService.createReservation(
                    ReservationsController.ReservationCreateDTO(
                        roomNumber = reservation.roomNumber,
                        guestsCount = reservation.guestsCount,
                        checkIn = reservation.checkIn,
                        checkOut = reservation.checkOut,
                        specialRequests = reservation.specialRequests,
                        guestUsername = guest.username,
                    ),
                )
            reservationsService.bindReservationToGuest(guest, reservation)
        }
    }

    data class ScheduleForPastAndRequestedServicesResponse(
        val id: String,
        val name: String,
        val employeeId: String,
        val employeeFullName: String,
        val imageUrl: String?,
        val price: Double,
        val datetime: LocalDateTime,
        val status: OrderStatus,
        val specialRequests: String?,
    )

    @GetMapping("/orders")
    @ResponseStatus(HttpStatus.OK)
    fun getAllOrdersForUser(principal: Principal): List<ScheduleForPastAndRequestedServicesResponse> {
        val userId = userService.findByUsernameOrThrow(principal.name).id!!
        return findAllByUserId(userId)
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

    private fun findAllByUserId(userId: String): List<ScheduleForPastAndRequestedServicesResponse> =
        scheduleService
            .findByGuestId(userId)
            .mapNotNull { scheduleItem ->
                val employeeFullName = userService.findUserNameById(scheduleItem.employeeId)
                val service = serviceService.getServiceDetailsById(scheduleItem.serviceId)

                if (employeeFullName == null || service == null) {
                    return@mapNotNull null
                }
                ScheduleForPastAndRequestedServicesResponse(
                    scheduleItem.id!!,
                    service.name,
                    scheduleItem.employeeId,
                    employeeFullName,
                    service.image,
                    service.price,
                    scheduleItem.serviceDate,
                    scheduleItem.status,
                    scheduleItem.specialRequests,
                )
            }
}
