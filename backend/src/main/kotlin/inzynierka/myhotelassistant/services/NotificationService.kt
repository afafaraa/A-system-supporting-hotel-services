package inzynierka.myhotelassistant.services

import inzynierka.myhotelassistant.exceptions.HttpException.NoPermissionException
import inzynierka.myhotelassistant.models.notification.NotificationDTO
import inzynierka.myhotelassistant.models.notification.NotificationEntity
import inzynierka.myhotelassistant.models.user.Role
import inzynierka.myhotelassistant.repositories.NotificationRepository
import org.springframework.security.oauth2.jwt.JwtDecoder
import org.springframework.stereotype.Service
import java.time.Duration
import java.time.Instant

@Service
class NotificationService(
    private val jwtDecoder: JwtDecoder,
    private val userService: UserService,
    private val notificationRepository: NotificationRepository,
) {

    fun getNotifications(authHeader: String): List<NotificationDTO> {
        val jwtData = decodeJwtData(authHeader)
        return getNotificationsFromUsername(jwtData.username)
    }

    fun getNotificationsOfGivenUser(username: String, authHeader: String): List<NotificationDTO> {
        validatePermission(username, authHeader)
        return getNotificationsFromUsername(username)
    }

    private fun getNotificationsFromUsername(username: String): List<NotificationDTO> {
        val userId: String = userService.findIdByUsernameOrThrow(username)
        val notifications: List<NotificationEntity> = notificationRepository.findAllByUserIdOrderByCreatedAtDesc(userId)
        return notifications.map { convertToDTO(it) }
    }

    fun markAsRead(notificationIds: List<String>) {
        val now = Instant.now()
        val notifications: List<NotificationEntity> = notificationRepository.findAllById(notificationIds)
        notifications.forEach { n ->
            n.isRead = true
            n.readAt = now
        }
        notificationRepository.saveAll(notifications)
    }

    fun removeReadNotifications(daysBack: Integer): Long {
        val readBefore = Instant.now().minus(Duration.ofDays(daysBack.toLong()))
        return notificationRepository.deleteAllByIsReadTrueAndReadAtBefore(readBefore)
    }

    private fun validatePermission(username: String, authHeader: String) {
        val jwtData = decodeJwtData(authHeader)
        if (username != jwtData.username && !isRoleEntitled(jwtData.role))
            throw NoPermissionException("You do not have permission to notifications of user: $username.")
    }

    private fun isRoleEntitled(role: String): Boolean {
        return role == Role.MANAGER.name || role == Role.ADMIN.name
    }

    private data class JwtData(val username: String, val role: String)

    private fun decodeJwtData(authHeader: String): JwtData {
        val token = authHeader.split(" ")[1]
        val jwt = jwtDecoder.decode(token)
        val username = jwt.subject
        val role = jwt.getClaimAsString("role")?.split("_")?.get(1) ?: Role.GUEST.name
        return JwtData(username, role)
    }

    fun convertToDTO(notification: NotificationEntity): NotificationDTO =
        NotificationDTO(
            id = notification.id!!,
            title = notification.title,
            message = notification.message,
            timestamp = notification.createdAt,
        )

    fun addNotificationToUser(userId: String, title: String, message: String, ) {
        val notification = NotificationEntity(
            userId = userId,
            title = title,
            message = message,
        )
        notificationRepository.save(notification)
    }
}