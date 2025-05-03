package inzynierka.myhotelassistant.models.notification

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document
import java.time.Instant

@Document(collection = "notifications")
data class NotificationEntity(
    @Id val id: String? = null,
    val userId: String,
    val text: String,
    val datetime: Instant,
)
