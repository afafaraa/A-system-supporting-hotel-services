package inzynierka.myhotelassistant.models.service

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document
import kotlin.time.Duration

@Document(collection = "services")
data class ServiceEntity(
    @Id val id: String? = null,
    var name: String,
    var description: String? = null,
    var price: Double,
    var type: MutableList<ServiceTypeAttributes> = mutableListOf(),
    var disabled: Boolean,
    var duration: Duration,
    var maxAvailable: Int? = null,
    var weekday: MutableList<WeekdayHour> = mutableListOf(),
    var image: String? = null,
)
