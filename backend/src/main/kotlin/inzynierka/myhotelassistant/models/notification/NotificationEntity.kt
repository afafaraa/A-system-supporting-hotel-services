package inzynierka.myhotelassistant.models.notification

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document
import java.time.Instant
import java.time.LocalDateTime

@Document(collection = "notifications")
data class NotificationEntity(
    @Id val id: String? = null,
    val userId: String,
    val title: String,
    val variant: NotificationVariant,
    val message: String,
    val createdAt: LocalDateTime = LocalDateTime.now(),
    var isRead: Boolean = false,
    var readAt: Instant? = null,
)
