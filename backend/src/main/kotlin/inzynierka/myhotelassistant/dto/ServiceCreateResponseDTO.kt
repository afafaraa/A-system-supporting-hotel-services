package inzynierka.myhotelassistant.dto

import inzynierka.myhotelassistant.models.service.Rating
import inzynierka.myhotelassistant.models.service.RatingEntity
import inzynierka.myhotelassistant.models.service.ServiceEntity
import inzynierka.myhotelassistant.models.service.ServiceType
import inzynierka.myhotelassistant.models.service.WeekdayHour

data class ServiceCreateResponseDTO(
    val id: String?,
    val name: String,
    val description: String?,
    val price: Double,
    val type: ServiceType,
    val disabled: Boolean,
    val rating: List<Rating>,
    val duration: Long,
    val maxAvailable: Int?,
    val weekday: List<WeekdayHour>,
    val image: String?,
) {
    companion object {
        fun from(
            entity: ServiceEntity,
            ratings: List<RatingEntity>,
        ): ServiceCreateResponseDTO {
            println("Entity: $entity")
            println("Ratings: $ratings")
            return ServiceCreateResponseDTO(
                id = entity.id,
                name = entity.name,
                description = entity.description,
                price = entity.price,
                type = entity.type,
                disabled = entity.disabled,
                rating = ratings.map { Rating.fromEntity(it) },
                duration = entity.duration.inWholeMinutes,
                maxAvailable = entity.maxAvailable,
                weekday = entity.weekday,
                image = entity.image,
            )
        }
    }
}
