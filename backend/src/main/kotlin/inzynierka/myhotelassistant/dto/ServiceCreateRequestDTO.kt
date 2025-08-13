package inzynierka.myhotelassistant.dto

import inzynierka.myhotelassistant.models.service.ServiceEntity
import inzynierka.myhotelassistant.models.service.ServiceType
import inzynierka.myhotelassistant.models.service.WeekdayHour
import kotlin.time.Duration.Companion.seconds

data class ServiceCreateRequestDTO(
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
    fun toEntity(): ServiceEntity =
        ServiceEntity(
            name = name,
            description = description,
            price = price,
            type = type,
            disabled = disabled,
            rating = mutableListOf(),
            duration = duration.seconds,
            maxAvailable = maxAvailable,
            weekday = weekday.toMutableList(),
            image = image,
        )
}
