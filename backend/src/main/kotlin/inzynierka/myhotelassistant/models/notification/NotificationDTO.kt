package inzynierka.myhotelassistant.models.notification

import java.time.LocalDateTime

data class NotificationDTO(
    val id: String,
    val title: String,
    val message: String,
    val timestamp: LocalDateTime,
)
