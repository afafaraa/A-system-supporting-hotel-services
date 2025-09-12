package inzynierka.myhotelassistant.models.service

import java.time.LocalDateTime

data class Rating(
    val fullName: String,
    val rating: Int,
    val comment: String?,
    val createdAt: LocalDateTime,
) {
    companion object {
        fun fromEntity(entity: RatingEntity): Rating =
            Rating(
                fullName = entity.fullName,
                rating = entity.rating,
                comment = entity.comment,
                createdAt = entity.createdAt,
            )
    }
}
