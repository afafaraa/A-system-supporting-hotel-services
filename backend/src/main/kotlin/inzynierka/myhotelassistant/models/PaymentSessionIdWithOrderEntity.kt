package inzynierka.myhotelassistant.models

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document

@Document(collection = "payment_sessions_with_orders")
data class PaymentSessionIdWithOrderEntity(
    @Id val paymentSessionId: String,
    val guestId: String,
    val itemIds: ItemIds,
) {
    data class ItemIds(
        val scheduleIds: List<String>,
        val reservationIds: List<String>,
    )
}
