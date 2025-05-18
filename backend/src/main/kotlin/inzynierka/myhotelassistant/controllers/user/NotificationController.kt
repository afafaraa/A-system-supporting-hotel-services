package inzynierka.myhotelassistant.controllers.user

import inzynierka.myhotelassistant.models.notification.NotificationDTO
import inzynierka.myhotelassistant.services.NotificationService
import org.springframework.web.bind.annotation.*


@RestController
@RequestMapping("/user/notifications")
class NotificationController(
    private val notificationService: NotificationService,
) {

    @GetMapping
    fun getNotifications(@RequestHeader("Authorization") authHeader: String): List<NotificationDTO> {
        return notificationService.getNotifications(authHeader)
    }

    @GetMapping(params = ["username"])
    fun getNotificationsGivenUsername(
        @RequestParam username: String,
        @RequestHeader("Authorization") authHeader: String
    ): List<NotificationDTO> {
        return notificationService.getNotificationsOfGivenUser(username, authHeader)
    }

    @PatchMapping("/mark-read")
    fun markAsRead(
        @RequestBody notificationIds: List<String>,
        @RequestHeader("Authorization") authHeader: String
    ) {
        notificationService.markAsRead(notificationIds, authHeader)
    }

    @DeleteMapping
    fun removeSelectedNotifications(
        @RequestBody notificationIds: List<String>,
        @RequestHeader("Authorization") authHeader: String
    ) {
        return notificationService.removeSelectedNotifications(notificationIds, authHeader)
    }
}
