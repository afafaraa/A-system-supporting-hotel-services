package inzynierka.myhotelassistant.models

import inzynierka.myhotelassistant.models.room.RoomEntity
import inzynierka.myhotelassistant.models.order.OrderEntity
import inzynierka.myhotelassistant.models.notification.NotificationEntity
import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document
import java.time.Instant

@Document(collection = "users")
data class UserEntity(
    @Id val id: String? = null,
    val username: String,
    var password: String,
    var email: String,
    val name: String? = null,
    val surname: String? = null,
    val room: RoomEntity? = null,
    val checkInDate: Instant? = null,
    val checkOutDate: Instant? = null,
    var role: Role = Role.GUEST,
    val orders: MutableList<OrderEntity> = mutableListOf(),
    val notifications: MutableList<NotificationEntity> = mutableListOf(),
)