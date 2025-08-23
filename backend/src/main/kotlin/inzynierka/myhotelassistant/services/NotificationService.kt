package inzynierka.myhotelassistant.services

import inzynierka.myhotelassistant.exceptions.HttpException.NoPermissionException
import inzynierka.myhotelassistant.models.notification.NotificationDTO
import inzynierka.myhotelassistant.models.notification.NotificationEntity
import inzynierka.myhotelassistant.models.notification.NotificationVariant
import inzynierka.myhotelassistant.models.user.Role
import inzynierka.myhotelassistant.repositories.NotificationRepository
import org.springframework.security.core.Authentication
import org.springframework.stereotype.Service
import java.security.Principal
import java.time.Duration
import java.time.Instant

@Service
class NotificationService(
    private val userService: UserService,
    private val notificationRepository: NotificationRepository,
) {
    fun getNotificationsOfGivenUser(
        username: String,
        authentication: Authentication,
    ): List<NotificationDTO> {
        val principal = authentication.principal as Principal
        val role = authentication.authorities.first().authority
        if (username != principal.name && !isRoleEntitled(role)) {
            throw NoPermissionException("You do not have permission to notifications of user: $username.")
        }
        return getNotificationsFromUsername(username)
    }

    private fun isRoleEntitled(role: String): Boolean = role == Role.MANAGER.name || role == Role.ADMIN.name

    fun getNotificationsFromUsername(username: String): List<NotificationDTO> {
        val userId: String = userService.findByUsernameOrThrow(username).id!!
        val notifications: List<NotificationEntity> = notificationRepository.findAllByUserIdOrderByCreatedAtDesc(userId)
        return notifications.map { convertToDTO(it) }
    }

    fun markAsRead(
        notificationIds: List<String>,
        username: String,
    ) {
        val userId: String = userService.findByUsernameOrThrow(username).id!!
        val now = Instant.now()
        val notifications: List<NotificationEntity> = notificationRepository.findAllById(notificationIds)
        notifications
            .filter { it.userId == userId }
            .forEach { n ->
                n.isRead = true
                n.readAt = now
            }
        notificationRepository.saveAll(notifications)
    }

    fun removeSelectedNotifications(
        notificationIds: List<String>,
        username: String,
    ) {
        val userId: String = userService.findByUsernameOrThrow(username).id!!
        notificationRepository.deleteAllByUserIdAndIdIn(userId, notificationIds)
    }

    fun removeReadNotifications(daysBack: Integer): Long {
        val readBefore = Instant.now().minus(Duration.ofDays(daysBack.toLong()))
        return notificationRepository.deleteAllByIsReadTrueAndReadAtBefore(readBefore)
    }

    fun convertToDTO(notification: NotificationEntity): NotificationDTO =
        NotificationDTO(
            id = notification.id!!,
            title = notification.title,
            variant = notification.variant,
            message = notification.message,
            timestamp = notification.createdAt,
            isRead = notification.isRead,
        )

    fun addNotificationToUser(
        userId: String,
        title: String,
        variant: NotificationVariant,
        message: String,
    ) {
        val notification =
            NotificationEntity(
                userId = userId,
                title = title,
                variant = variant,
                message = message,
            )
        notificationRepository.save(notification)
    }

    fun getUnreadNotificationsCount(username: String): Long {
        val userId: String = userService.findByUsernameOrThrow(username).id!!
        return notificationRepository.countByUserIdAndIsReadFalse(userId)
    }
}
