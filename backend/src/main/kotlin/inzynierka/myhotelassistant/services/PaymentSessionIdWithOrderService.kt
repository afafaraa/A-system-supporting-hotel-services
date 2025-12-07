package inzynierka.myhotelassistant.services

import inzynierka.myhotelassistant.models.PaymentSessionIdWithOrderEntity
import inzynierka.myhotelassistant.repositories.PaymentSessionIdWithOrderRepository
import org.springframework.stereotype.Service

@Service
class PaymentSessionIdWithOrderService(
    private val paymentSessionRepository: PaymentSessionIdWithOrderRepository,
) {
    fun deletePaymentSessionById(paymentSessionId: String): PaymentSessionIdWithOrderEntity? =
        paymentSessionRepository.deleteByPaymentSessionId(paymentSessionId)

    fun saveFromOrderResult(
        paymentSessionId: String,
        guestId: String,
        orderResult: OrderService.OrderResult,
    ): PaymentSessionIdWithOrderEntity {
        val entity =
            PaymentSessionIdWithOrderEntity(
                paymentSessionId = paymentSessionId,
                guestId = guestId,
                itemIds =
                    PaymentSessionIdWithOrderEntity.ItemIds(
                        scheduleIds = orderResult.schedules.map { it.id!! },
                        reservationIds = orderResult.reservations.map { it.id!! },
                    ),
            )
        return paymentSessionRepository.save(entity)
    }
}
