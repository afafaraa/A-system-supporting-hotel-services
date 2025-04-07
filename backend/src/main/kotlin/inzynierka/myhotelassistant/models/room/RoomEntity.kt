package inzynierka.myhotelassistant.models.room

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document

@Document(collation = "rooms")
data class RoomEntity(
    @Id val id: String? = null,
    val floor: Int,
    val roomNumber: Int,
    val capacity: Int,
)