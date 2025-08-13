package inzynierka.myhotelassistant.models.schedule

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document
import java.time.DayOfWeek
import java.time.LocalDateTime

@Document(collection = "schedule")
data class ScheduleEntity(
    @Id var id: String? = null,
    var serviceId: String,
    var serviceDate: LocalDateTime,
    var weekday: DayOfWeek,
    var employeeId: String,
    var guestId: String? = null,
    var orderTime: LocalDateTime? = null,
    var price: Double? = null,
    var status: OrderStatus = OrderStatus.AVAILABLE,
    var cancellationReason: CancellationReason? = null,
)
