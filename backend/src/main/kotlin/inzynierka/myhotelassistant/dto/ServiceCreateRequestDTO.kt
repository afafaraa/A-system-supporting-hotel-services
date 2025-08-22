package inzynierka.myhotelassistant.dto

import com.fasterxml.jackson.annotation.JsonProperty
import inzynierka.myhotelassistant.models.service.ServiceEntity
import inzynierka.myhotelassistant.models.service.ServiceType
import inzynierka.myhotelassistant.models.service.WeekdayHour
import kotlin.time.Duration

data class ServiceCreateRequestDTO(
    var name: String,
    var description: String? = null,
    var price: Double,
    var type: ServiceType,
    var disabled: Boolean = false,
    @JsonProperty("duration")
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
            type = type,
            disabled = disabled,
            rating = mutableListOf(),
            duration = getDurationFromMinutes() ?: Duration.ZERO,
            maxAvailable = maxAvailable,
            weekday = weekday?.toMutableList() ?: mutableListOf(),
            image = image,
        )

    fun getDurationFromMinutes(): Duration? = duration?.let { Duration.parse("${it}m") }

    fun getWeekdayHours(): MutableList<WeekdayHour>? = weekday?.toMutableList()
}
