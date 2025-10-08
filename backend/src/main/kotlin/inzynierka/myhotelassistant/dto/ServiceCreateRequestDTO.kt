package inzynierka.myhotelassistant.dto

import inzynierka.myhotelassistant.models.service.ServiceEntity
import inzynierka.myhotelassistant.models.service.ServiceType
import inzynierka.myhotelassistant.models.service.ServiceTypeAttributes
import inzynierka.myhotelassistant.models.service.WeekdayHour
import kotlin.time.Duration
import kotlin.time.Duration.Companion.minutes

data class ServiceCreateRequestDTO(
    var name: String,
    var description: String? = null,
    var price: Double,
    var type: ServiceType,
    var attributes: ServiceTypeAttributes? = null,
    var disabled: Boolean = false,
    var duration: Long? = null,
    var maxAvailable: Int? = null,
    var weekday: List<WeekdayHour>? = emptyList(),
    var image: String? = null,
) {
    fun toEntity(): ServiceEntity =
        ServiceEntity(
            name = name,
            description = description,
            price = price,
            type = attributes?.getType() ?: type,
            attributes = attributes,
            disabled = disabled,
            duration = getDurationFromMinutes() ?: Duration.ZERO,
            maxAvailable = maxAvailable,
            weekday = weekday?.toMutableList() ?: mutableListOf(),
            image = image,
        )

    fun getDurationFromMinutes(): Duration? = duration?.minutes

    fun getWeekdayHours(): MutableList<WeekdayHour>? = weekday?.toMutableList()
}
