package inzynierka.myhotelassistant.dto

import inzynierka.myhotelassistant.models.service.Rating
import inzynierka.myhotelassistant.models.service.ServiceEntity
import inzynierka.myhotelassistant.models.service.ServiceType
import inzynierka.myhotelassistant.models.service.WeekdayHour
import kotlin.time.Duration.Companion.seconds

data class ServiceCreateRequest(
    var name: String,
    var description: String? = null,
    var price: Double,
    var type: ServiceType,
    var disabled: Boolean = false,
    var duration: Long,
    var maxAvailable: Int? = null,
    var weekday: List<WeekdayHour> = emptyList(),
    var image: String? = null,
) {
    fun toEntity(): ServiceEntity = ServiceEntity(
        name = name,
        description = description,
        price = price,
        type = type,
        disabled = disabled,
        rating = mutableListOf(),
        duration = duration.seconds,
        maxAvailable = maxAvailable,
        weekday = weekday.toMutableList(),
        image = image
    )
}

data class ServiceResponse(
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
        fun from(entity: ServiceEntity): ServiceResponse = ServiceResponse(
            id = entity.id,
            name = entity.name,
            description = entity.description,
            price = entity.price,
            type = entity.type,
            disabled = entity.disabled,
            rating = entity.rating,
            duration = entity.duration.inWholeSeconds,
            maxAvailable = entity.maxAvailable,
            weekday = entity.weekday,
            image = entity.image
        )
    }
}
