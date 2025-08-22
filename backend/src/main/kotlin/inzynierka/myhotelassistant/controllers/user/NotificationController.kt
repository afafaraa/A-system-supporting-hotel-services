package inzynierka.myhotelassistant.controllers.user

import inzynierka.myhotelassistant.models.notification.NotificationDTO
import inzynierka.myhotelassistant.services.NotificationService
import org.springframework.security.core.Authentication
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PatchMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import java.security.Principal

@RestController
@RequestMapping("/user/notifications")
class NotificationController(
    private val notificationService: NotificationService,
) {
    @GetMapping
    fun getNotifications(principal: Principal): List<NotificationDTO> = notificationService.getNotificationsFromUsername(principal.name)

    @GetMapping(params = ["username"])
    fun getNotificationsGivenUsername(
        @RequestParam username: String,
        authentication: Authentication,
    ): List<NotificationDTO> = notificationService.getNotificationsOfGivenUser(username, authentication)

    @GetMapping("/unread-count")
    fun getUnreadNotificationsCount(principal: Principal): Long = notificationService.getUnreadNotificationsCount(principal.name)

    @PatchMapping("/mark-read")
    fun markAsRead(
        @RequestBody notificationIds: List<String>,
        principal: Principal,
    ) {
        notificationService.markAsRead(notificationIds, principal.name)
    }

    @DeleteMapping
    fun removeSelectedNotifications(
        @RequestBody notificationIds: List<String>,
        principal: Principal,
    ) = notificationService.removeSelectedNotifications(notificationIds, principal.name)
}
