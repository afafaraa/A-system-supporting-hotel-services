package inzynierka.myhotelassistant.models

import inzynierka.myhotelassistant.models.room.RoomEntity
import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document
import java.time.Instant
import java.time.LocalDateTime

@Document(collection = "users")
data class UserEntity(
    @Id val id: String? = null,
    val username: String,
    val password: String,
    val email: String,
    val name: String? = null,
    val surname: String? = null,
    val room: RoomEntity? = null,
    val checkInDate: Instant? = null,
    val checkOutDate: Instant? = null,
    val roles: List<Role> = mutableListOf(),
    val orders: List<String> = mutableListOf(),
    val notifications: List<String> = mutableListOf(),
)