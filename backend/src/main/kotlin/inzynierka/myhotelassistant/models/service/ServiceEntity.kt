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
    var type: ServiceType,
    var disabled: Boolean,
    var rating: MutableList<Int>,
    var duration: Duration,
    var maxAvailable: Int? = null,
    var weekday: WeekdayHour,
)
