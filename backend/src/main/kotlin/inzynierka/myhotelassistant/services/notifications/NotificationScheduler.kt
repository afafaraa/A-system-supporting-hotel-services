package inzynierka.myhotelassistant.services.notifications

import inzynierka.myhotelassistant.models.notification.NotificationVariant
import inzynierka.myhotelassistant.models.reservation.ReservationEntity
import inzynierka.myhotelassistant.models.reservation.ReservationStatus
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
    private val dateOnlyFormatter = DateTimeFormatter.ofPattern("dd.MM.yyyy")

    fun notifyGuestOnSuccessfulOrder(schedule: ScheduleEntity) {
        val guestId = schedule.guestId ?: return
        val service = serviceService.findByIdOrThrow(schedule.serviceId)

        val title = "Service Order Confirmed"
        val message = "Your order for '${service.name}' has been successfully placed for ${schedule.serviceDate.format(dateFormatter)}."

        notificationService.addNotificationToUser(
            userId = guestId,
            title = title,
            variant = NotificationVariant.CONFIRMATION,
            message = message,
        )
    }

    fun notifyGuestOnStatusChange(
        schedule: ScheduleEntity,
        oldStatus: OrderStatus,
        newStatus: OrderStatus,
    ) {
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
            message = message,
        )
    }

    private fun getNotificationContent(
        serviceName: String,
        schedule: ScheduleEntity,
        oldStatus: OrderStatus,
        newStatus: OrderStatus,
    ): Triple<String, NotificationVariant, String> {
        val dateTime = schedule.serviceDate.format(dateFormatter)

        return when (newStatus) {
            OrderStatus.ACTIVE ->
                Triple(
                    "Service Confirmed",
                    NotificationVariant.CONFIRMATION,
                    "Your service '$serviceName' scheduled for $dateTime has been confirmed and is now active.",
                )
            OrderStatus.COMPLETED ->
                Triple(
                    "Service Completed",
                    NotificationVariant.NOTICE,
                    "Your service '$serviceName' has been completed. Thank you for using our services!",
                )
            OrderStatus.CANCELED -> {
                val reason = schedule.cancellationReason?.let { getCancellationReasonDisplayName(it) } ?: "No reason provided"
                Triple(
                    "Service Cancelled",
                    NotificationVariant.ALERT,
                    "Your service '$serviceName' scheduled for $dateTime has been cancelled. Reason: $reason",
                )
            }
            OrderStatus.REQUESTED ->
                Triple(
                    "Service Requested",
                    NotificationVariant.NOTICE,
                    "Your service request for '$serviceName' is being processed.",
                )
            else ->
                Triple(
                    "Service Status Update",
                    NotificationVariant.NOTICE,
                    "Your service '$serviceName' status has changed from ${oldStatus.name} to ${newStatus.name}.",
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

    fun notifyGuestOnSuccessfulReservation(reservation: ReservationEntity) {
        val title = "Reservation Confirmed"
        val message =
            "Your reservation for room ${reservation.roomNumber} from " +
                "${reservation.checkIn.format(dateOnlyFormatter)} to ${reservation.checkOut.format(dateOnlyFormatter)} " +
                "has been successfully created."

        notificationService.addNotificationToUser(
            userId = reservation.guestId,
            title = title,
            variant = NotificationVariant.CONFIRMATION,
            message = message,
        )
    }

    fun notifyGuestOnReservationStatusChange(
        reservation: ReservationEntity,
        oldStatus: ReservationStatus,
        newStatus: ReservationStatus,
    ) {
        val (title, variant, message) = getReservationNotificationContent(reservation, oldStatus, newStatus)

        notificationService.addNotificationToUser(
            userId = reservation.guestId,
            title = title,
            variant = variant,
            message = message,
        )
    }

    private fun getReservationNotificationContent(
        reservation: ReservationEntity,
        oldStatus: ReservationStatus,
        newStatus: ReservationStatus,
    ): Triple<String, NotificationVariant, String> {
        val checkInDate = reservation.checkIn.format(dateOnlyFormatter)
        val checkOutDate = reservation.checkOut.format(dateOnlyFormatter)

        return when (newStatus) {
            ReservationStatus.CONFIRMED ->
                Triple(
                    "Reservation Approved",
                    NotificationVariant.CONFIRMATION,
                    "Your reservation for room ${reservation.roomNumber} from $checkInDate to $checkOutDate has been approved.",
                )
            ReservationStatus.REJECTED -> {
                val reason = reservation.rejectReason ?: "No reason provided"
                Triple(
                    "Reservation Rejected",
                    NotificationVariant.ALERT,
                    "Your reservation for room ${reservation.roomNumber} has been rejected. Reason: $reason",
                )
            }
            ReservationStatus.CANCELED ->
                Triple(
                    "Reservation Cancelled",
                    NotificationVariant.NOTICE,
                    "Your reservation for room ${reservation.roomNumber} from $checkInDate to $checkOutDate has been cancelled.",
                )
            ReservationStatus.CHECKED_IN ->
                Triple(
                    "Check-In Complete",
                    NotificationVariant.CONFIRMATION,
                    "You have successfully checked in to room ${reservation.roomNumber}. Enjoy your stay!",
                )
            ReservationStatus.COMPLETED ->
                Triple(
                    "Check-Out Complete",
                    NotificationVariant.NOTICE,
                    "You have successfully checked out from room ${reservation.roomNumber}. Thank you for staying with us!",
                )
            else ->
                Triple(
                    "Reservation Status Update",
                    NotificationVariant.NOTICE,
                    "Your reservation for room ${reservation.roomNumber} status has changed to ${newStatus.name}.",
                )
        }
    }
}
