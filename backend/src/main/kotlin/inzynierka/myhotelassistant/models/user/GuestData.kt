package inzynierka.myhotelassistant.models.user

import inzynierka.myhotelassistant.models.order.OrderEntity
import java.time.Instant

data class GuestData(
    val roomNumber: String,
    val checkInDate: Instant,
    val checkOutDate: Instant,
    var orders: MutableList<OrderEntity> = mutableListOf(),
)
