package inzynierka.myhotelassistant.services

import inzynierka.myhotelassistant.exceptions.HttpException
import inzynierka.myhotelassistant.models.schedule.OrderStatus
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

    fun cancel(guest: UserEntity, orderId: String) {
        val scheduledService = scheduleService.findByIdOrThrow(orderId)

        if (guest.id!! != scheduledService.guestId) {
            throw HttpException.NoPermissionException("You are not allowed to cancel order for other guests")
        }
        if (Duration.between(LocalDateTime.now(), scheduledService.serviceDate).toHours() < 1) {
            throw HttpException.NoPermissionException("Cannot cancel the order less than 24 hours before the service")
        }

        scheduledService.guestId = null
        scheduledService.status = OrderStatus.AVAILABLE
        guest.guestData?.let { data ->
            data.bill -= scheduledService.price
        }
        scheduleService.save(scheduledService)
        userService.save(guest)
    }

    fun order(guest: UserEntity, scheduleId: String) {
        val schedule = scheduleService.findByIdOrThrow(scheduleId)
        val service = serviceService.findByIdOrThrow(schedule.serviceId)
        val currentPrice = service.price
        schedule.guestId = guest.id
        schedule.status = OrderStatus.REQUESTED
        schedule.price = currentPrice
        guest.guestData?.let { data ->
            data.bill += schedule.price
        }
        scheduleService.save(schedule)
        userService.save(guest)
    }
}