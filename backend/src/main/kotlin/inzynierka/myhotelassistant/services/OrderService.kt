package inzynierka.myhotelassistant.services

import inzynierka.myhotelassistant.controllers.ReservationsController
import inzynierka.myhotelassistant.dto.OrderRequest
import inzynierka.myhotelassistant.exceptions.HttpException
import inzynierka.myhotelassistant.models.PaymentSessionIdWithOrderEntity
import inzynierka.myhotelassistant.models.reservation.ReservationEntity
import inzynierka.myhotelassistant.models.schedule.OrderStatus
import inzynierka.myhotelassistant.models.schedule.ScheduleEntity
import inzynierka.myhotelassistant.models.service.ReservationsService
import inzynierka.myhotelassistant.models.user.UserEntity
import inzynierka.myhotelassistant.services.notifications.NotificationScheduler
import org.springframework.stereotype.Component
import java.time.Duration
import java.time.LocalDate
import java.time.LocalDateTime

@Component
class OrderService(
    private val scheduleService: ScheduleService,
    private val userService: UserService,
    private val serviceService: ServiceService,
    private val reservationsService: ReservationsService,
    private val notificationScheduler: NotificationScheduler,
) {
    fun cancel(
        guest: UserEntity,
        orderId: String,
    ) {
        val scheduledService = scheduleService.findByIdOrThrow(orderId)

        if (guest.id!! != scheduledService.guestId) {
            throw HttpException.NoPermissionException("You are not allowed to cancel order for other guests")
        }
        if (Duration.between(LocalDateTime.now(), scheduledService.serviceDate).toHours() < 1) {
            throw HttpException.NoPermissionException("Cannot cancel the order less than 24 hours before the service")
        }

        scheduledService.guestId = null
        scheduledService.status = OrderStatus.AVAILABLE
        scheduledService.specialRequests = null
        guest.guestData?.removeElementFromBill(scheduledService.id!!)
        scheduleService.save(scheduledService)
        userService.save(guest)
    }

    fun order(
        guest: UserEntity,
        scheduleId: String,
        specialRequests: String? = null,
        customPrice: Double? = null,
    ): ScheduleEntity {
        val schedule = scheduleService.findByIdOrThrow(scheduleId)
        val service = serviceService.findByIdOrThrow(schedule.serviceId)
        val currentPrice = if (customPrice != null && service.price < 0.01) customPrice else service.price
        schedule.guestId = guest.id
        schedule.orderTime = LocalDateTime.now()
        schedule.status = OrderStatus.REQUESTED
        schedule.price = currentPrice
        schedule.specialRequests = specialRequests
        guest.guestData?.addServiceToBill(schedule.id!!, schedule.price!!, schedule.orderTime!!)
        val savedSchedule = scheduleService.save(schedule)
        userService.save(guest)
        if (schedule.serviceDate.toLocalDate().isEqual(LocalDate.now())) {
            notificationScheduler.notifyEmployeeOfNewScheduleForToday(savedSchedule, service)
        }
        return savedSchedule
    }

    data class OrderResult(
        val schedules: List<ScheduleEntity>,
        val reservations: List<ReservationEntity>,
    )

    fun makeOrderFromItems(
        guest: UserEntity,
        items: OrderRequest,
    ): OrderResult {
        val schedules =
            items.schedules.map { (scheduleId, specialRequests, customPrice) ->
                val schedule = order(guest, scheduleId, specialRequests, customPrice)
                notificationScheduler.notifyGuestOnSuccessfulOrder(schedule)
                schedule
            }

        val reservations =
            items.reservations.map { reservation ->
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
                reservation
            }

        return OrderResult(schedules, reservations)
    }

    fun setItemsAsPaid(
        guestId: String,
        itemIds: PaymentSessionIdWithOrderEntity.ItemIds,
    ) {
        val guest = userService.findByIdOrThrow(guestId)
        guest.guestData?.let { data ->
            itemIds.scheduleIds.forEach { id -> data.removeElementFromBill(id) }
            itemIds.reservationIds.forEach { id -> data.removeElementFromBill(id) }
            userService.save(guest)
        }
    }
}
