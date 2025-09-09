package inzynierka.myhotelassistant.models.service

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document
import java.time.LocalDateTime

@Document(collection = "ratings")
data class RatingEntity(
    @Id val ratingId: String? = null,
    val serviceId: String,
    val scheduleId: String,
    val employeeId: String,
    val guestId: String,
    val fullName: String,
    val stars: Int,
    val comment: String? = null,
    val createdAt: LocalDateTime = LocalDateTime.now(),
)
