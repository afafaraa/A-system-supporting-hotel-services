package inzynierka.myhotelassistant.services

import inzynierka.myhotelassistant.exceptions.HttpException.NoPermissionException
import inzynierka.myhotelassistant.models.notification.NotificationDTO
import inzynierka.myhotelassistant.models.notification.NotificationEntity
import inzynierka.myhotelassistant.models.user.Role
import inzynierka.myhotelassistant.repositories.NotificationRepository
import inzynierka.myhotelassistant.utils.AuthHeaderDataExtractor
import org.springframework.stereotype.Service
import java.time.Duration
import java.time.Instant

@Service
class NotificationService(
    private val userService: UserService,
    private val notificationRepository: NotificationRepository,
    private val authExtractor: AuthHeaderDataExtractor,
) {
    fun getNotifications(authHeader: String): List<NotificationDTO> {
        val jwtData = authExtractor.decodeJwtData(authHeader)
        return getNotificationsFromUsername(jwtData.username)
    }

    fun getNotificationsOfGivenUser(
        username: String,
        authHeader: String,
    ): List<NotificationDTO> {
        val jwtData = authExtractor.decodeJwtData(authHeader)
        if (username != jwtData.username && !isRoleEntitled(jwtData.role)) {
            throw NoPermissionException("You do not have permission to notifications of user: $username.")
        }
        return getNotificationsFromUsername(username)
    }

    private fun isRoleEntitled(role: String): Boolean = role == Role.MANAGER.name || role == Role.ADMIN.name

    private fun getNotificationsFromUsername(username: String): List<NotificationDTO> {
        val userId: String = userService.findByUsernameOrThrow(username).id!!
        val notifications: List<NotificationEntity> = notificationRepository.findAllByUserIdOrderByCreatedAtDesc(userId)
        return notifications.map { convertToDTO(it) }
    }

    fun markAsRead(
        notificationIds: List<String>,
        authHeader: String,
    ) {
        val jwtData = authExtractor.decodeJwtData(authHeader)
        val userId: String = userService.findByUsernameOrThrow(jwtData.username).id!!
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
        authHeader: String,
    ) {
        val jwtData = authExtractor.decodeJwtData(authHeader)
        val userId: String = userService.findByUsernameOrThrow(jwtData.username).id!!
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
            message = notification.message,
            timestamp = notification.createdAt,
            isRead = notification.isRead,
        )

    fun addNotificationToUser(
        userId: String,
        title: String,
        message: String,
    ) {
        val notification =
            NotificationEntity(
                userId = userId,
                title = title,
                message = message,
            )
        notificationRepository.save(notification)
    }
}
