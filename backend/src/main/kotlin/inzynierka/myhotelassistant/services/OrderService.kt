package inzynierka.myhotelassistant.services

import inzynierka.myhotelassistant.exceptions.HttpException
import inzynierka.myhotelassistant.models.schedule.OrderStatus
import inzynierka.myhotelassistant.models.schedule.ScheduleEntity
import inzynierka.myhotelassistant.models.user.UserEntity
import org.springframework.stereotype.Component
import java.time.Duration
import java.time.LocalDateTime

@Component
class OrderService(
    private val scheduleService: ScheduleService,
    private val userService: UserService,
    private val serviceService: ServiceService,
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
        guest.guestData?.addServiceToBill(schedule.id!!, schedule.price!!)
        scheduleService.save(schedule)
        userService.save(guest)
        return schedule
    }
}
