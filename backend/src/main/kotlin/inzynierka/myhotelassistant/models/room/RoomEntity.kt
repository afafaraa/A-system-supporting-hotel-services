package inzynierka.myhotelassistant.models.room

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document

@Document(collection = "rooms")
data class RoomEntity(
    @Id val number: String,
    val floor: Int,
    val capacity: Int,
    val pricePerNight: Double,
    val standard: RoomStandard,
    val description: String? = null,
    val amenities: Set<RoomAmenity> = emptySet(),
)
