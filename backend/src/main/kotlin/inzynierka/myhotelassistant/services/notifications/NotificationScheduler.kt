package inzynierka.myhotelassistant.services.notifications

import inzynierka.myhotelassistant.models.notification.NotificationVariant
import inzynierka.myhotelassistant.models.schedule.CancellationReason
import inzynierka.myhotelassistant.models.schedule.OrderStatus
import inzynierka.myhotelassistant.models.schedule.ScheduleEntity
import inzynierka.myhotelassistant.services.ServiceService
import org.springframework.stereotype.Service
import java.time.format.DateTimeFormatter

@Service
class NotificationScheduler(
    private val notificationService: NotificationService,
    private val serviceService: ServiceService,
) {
    private val dateFormatter = DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm")

    fun notifyGuestOnSuccessfulOrder(schedule: ScheduleEntity) {
        val guestId = schedule.guestId ?: return
        val service = serviceService.findByIdOrThrow(schedule.serviceId)

        val title = "Service Order Confirmed"
        val message = "Your order for '${service.name}' has been successfully placed for ${schedule.serviceDate.format(dateFormatter)}."

        notificationService.addNotificationToUser(
            userId = guestId,
            title = title,
            variant = NotificationVariant.CONFIRMATION,
            message = message
        )

    }

    fun notifyGuestOnStatusChange(schedule: ScheduleEntity, oldStatus: OrderStatus, newStatus: OrderStatus) {
        val guestId = schedule.guestId ?: return

        // Only notify guests for their orders (not for AVAILABLE status)
        if (oldStatus == OrderStatus.AVAILABLE || newStatus == OrderStatus.AVAILABLE) {
            return
        }

        val service = serviceService.findByIdOrThrow(schedule.serviceId)
        val (title, variant, message) = getNotificationContent(service.name, schedule, oldStatus, newStatus)

        notificationService.addNotificationToUser(
            userId = guestId,
            title = title,
            variant = variant,
            message = message
        )
    }

    private fun getNotificationContent(
        serviceName: String,
        schedule: ScheduleEntity,
        oldStatus: OrderStatus,
        newStatus: OrderStatus
    ): Triple<String, NotificationVariant, String> {
        val dateTime = schedule.serviceDate.format(dateFormatter)

        return when (newStatus) {
            OrderStatus.ACTIVE -> Triple(
                "Service Confirmed",
                NotificationVariant.CONFIRMATION,
                "Your service '$serviceName' scheduled for $dateTime has been confirmed and is now active."
            )
            OrderStatus.COMPLETED -> Triple(
                "Service Completed",
                NotificationVariant.NOTICE,
                "Your service '$serviceName' has been completed. Thank you for using our services!"
            )
            OrderStatus.CANCELED -> {
                val reason = schedule.cancellationReason?.let { getCancellationReasonDisplayName(it) } ?: "No reason provided"
                Triple(
                    "Service Cancelled",
                    NotificationVariant.ALERT,
                    "Your service '$serviceName' scheduled for $dateTime has been cancelled. Reason: $reason"
                )
            }
            OrderStatus.REQUESTED -> Triple(
                "Service Requested",
                NotificationVariant.NOTICE,
                "Your service request for '$serviceName' is being processed."
            )
            else -> Triple(
                "Service Status Update",
                NotificationVariant.NOTICE,
                "Your service '$serviceName' status has changed from ${oldStatus.name} to ${newStatus.name}."
            )
        }
    }

    private fun getCancellationReasonDisplayName(reason: CancellationReason): String =
        when (reason) {
            CancellationReason.OVERLAPPING_TERMS -> "Overlapping terms"
            CancellationReason.PERSONAL_REASONS -> "Personal reasons"
            CancellationReason.ILLNESS -> "Illness"
            CancellationReason.OTHER -> "Other"
            CancellationReason.UNKNOWN -> "Unknown"
        }
}
