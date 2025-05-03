package inzynierka.myhotelassistant.models.order

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document
import java.time.Instant

@Document(collection = "orders")
data class OrderEntity (
    @Id val id: String? = null,
    val serviceId: String,
    val orderDate: Instant = Instant.now(),
    val orderForDate: Instant,
    var status: OrderStatus = OrderStatus.PENDING,
)
