package inzynierka.myhotelassistant.repositories

import inzynierka.myhotelassistant.models.PaymentSessionIdWithOrderEntity
import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.stereotype.Repository

@Repository
interface PaymentSessionIdWithOrderRepository : MongoRepository<PaymentSessionIdWithOrderEntity, String> {
    fun deleteByPaymentSessionId(paymentSessionId: String): PaymentSessionIdWithOrderEntity?
}
