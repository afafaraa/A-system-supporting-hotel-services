package inzynierka.myhotelassistant.models.room

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document


@Document(collection = "room_standards")
data class RoomStandardEntity(
    @Id val id: String? = null,
    val name: String,
    val capacity: Int,
    val basePrice: Double,
    val description: String? = null
)