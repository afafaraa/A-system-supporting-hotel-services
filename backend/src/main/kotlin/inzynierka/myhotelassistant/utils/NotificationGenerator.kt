package inzynierka.myhotelassistant.utils

import inzynierka.myhotelassistant.models.notification.NotificationVariant
import inzynierka.myhotelassistant.models.notification.NotificationVariant.ALERT
import inzynierka.myhotelassistant.models.notification.NotificationVariant.NOTICE
import inzynierka.myhotelassistant.services.notifications.NotificationService
import org.springframework.stereotype.Component

@Component
class NotificationGenerator(
    private val notificationService: NotificationService,
) {
    enum class Content(
        val variant: NotificationVariant,
        val withEmail: Boolean,
    ) {
        EMPLOYEE_NEW_REVIEW_RECEIVED(NOTICE, false),
        EMPLOYEE_TODAY_SCHEDULE_INFO(NOTICE, false),
        EMPLOYEE_SCHEDULE_COMPLETION_TIME_EXCEEDED(ALERT, false),
        EMPLOYEE_SCHEDULE_CONFIRMATION_TIME_EXCEEDED(ALERT, true),
        EMPLOYEE_NEW_SCHEDULE_ASSIGNED_FOR_TODAY(NOTICE, true),

        RECEPTIONIST_TODAY_ARRIVAL_DEPARTURE_INFO(NOTICE, false),
        RECEPTIONIST_RESERVATION_CONFIRMATION_REMINDER(NOTICE, true),
    }

    fun pushNotificationToUser(
        userId: String,
        content: Content,
        args: Array<Any>,
    ) {
        val (title, message) = getNotificationTitleAndMessage(content, *args)
        notificationService.addNotificationToUser(userId, title, content.variant, message, content.withEmail)
    }

    private fun getNotificationTitleAndMessage(
        content: Content,
        vararg args: Any,
    ): Pair<String, String> {
        val (title, rawMessage) =
            when (content) {
                Content.EMPLOYEE_NEW_REVIEW_RECEIVED ->
                    Pair(
                        "New Review Received",
                        "You have received a new review from %s. Rating: %d/5 stars.",
                    )
                Content.EMPLOYEE_TODAY_SCHEDULE_INFO ->
                    Pair(
                        "Today's Schedule Overview",
                        "You have %d scheduled tasks to perform and %d pending tasks to accept for today.",
                    )
                Content.EMPLOYEE_SCHEDULE_COMPLETION_TIME_EXCEEDED ->
                    Pair(
                        "Service Completion Overdue",
                        "The expected completion time for a service \"%s\" at %s has passed. Please confirm completion or reject the service immediately.",
                    )
                Content.EMPLOYEE_SCHEDULE_CONFIRMATION_TIME_EXCEEDED ->
                    Pair(
                        "Service Confirmation Overdue",
                        "The start time for a service \"%s\" (%s) has passed, but the service has not been confirmed yet. Please take action.",
                    )
                Content.EMPLOYEE_NEW_SCHEDULE_ASSIGNED_FOR_TODAY ->
                    Pair(
                        "New Task Assigned",
                        "A new service has been added to your schedule for today. Service: \"%s\" at %s.",
                    )
                Content.RECEPTIONIST_TODAY_ARRIVAL_DEPARTURE_INFO ->
                    Pair(
                        "Today's Check-in/Check-out Summary",
                        "Check all arrivals and departures for today. Check-ins: %d (including %d overdue). Check-outs: %d (including %d overdue).",
                    )
                Content.RECEPTIONIST_RESERVATION_CONFIRMATION_REMINDER ->
                    Pair(
                        "Pending Reservations Reminder",
                        "You have %d reservations starting within the next 7 days that require confirmation.",
                    )
            }
        return try {
            Pair(title, rawMessage.format(*args))
        } catch (_: Exception) {
            Pair(title, rawMessage)
        }
    }
}
