package inzynierka.myhotelassistant.models.service

import com.fasterxml.jackson.annotation.JsonProperty
import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document
import kotlin.time.Duration

@Document(collection = "services")
data class ServiceEntity(
    @Id val id: String? = null,
    var name: String,
    var description: String? = null,
    var price: Double,
    var type: ServiceType,
    var attributes: ServiceTypeAttributes? = null,
    var disabled: Boolean,
    var duration: Duration,
    var maxAvailable: Int? = null,
    var weekday: MutableList<WeekdayHour> = mutableListOf(),
    var image: String? = null,
) {
    @field:JsonProperty("minPrice")
    val minPrice: Double? =
        if (price >= 0.01) {
            null
        } else {
            when (val attrs = attributes) {
                is ServiceTypeAttributes.Selection -> {
                    attrs.options.values
                        .flatten()
                        .minOfOrNull { it.price }
                }
                else -> null
            }
        }
}
