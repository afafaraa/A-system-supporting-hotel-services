package inzynierka.myhotelassistant.models.notification

import java.time.LocalDateTime

data class NotificationDTO(
    val id: String,
    val title: String,
    val variant: NotificationVariant,
    val message: String,
    val timestamp: LocalDateTime,
    val isRead: Boolean,
)
