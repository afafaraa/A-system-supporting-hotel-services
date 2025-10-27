package inzynierka.myhotelassistant.services

import inzynierka.myhotelassistant.controllers.PaymentController.CheckoutRequest
import org.springframework.stereotype.Service
import java.time.LocalDate
import java.time.temporal.ChronoUnit

@Service
class PaymentService(
    private val scheduleService: ScheduleService,
    private val serviceService: ServiceService,
    private val roomService: RoomService,
) {
    fun createCheckoutSession(request: CheckoutRequest): Map<String, Any> {
        if (request.cartItems.isEmpty()) {
            throw IllegalArgumentException("Cart is empty")
        }

        var totalAmountCents = 0
        val itemDetails = mutableListOf<Map<String, Any>>()

        request.cartItems.forEach { item ->
            when (item.type) {
                "SERVICE" -> {
                    val schedule = scheduleService.findByIdOrThrow(item.id)
                    val service = serviceService.findByIdOrThrow(schedule.serviceId)
                    val priceCents = (service.price * 100).toInt()
                    totalAmountCents += priceCents

                    itemDetails.add(
                        mapOf(
                            "id" to item.id,
                            "type" to "SERVICE",
                            "name" to service.name,
                            "price" to service.price,
                            "priceCents" to priceCents,
                        ),
                    )
                }
                "RESERVATION" -> {
                    val room = roomService.findRoomByNumber(item.id)
                    val checkIn = LocalDate.parse(item.checkIn ?: throw IllegalArgumentException("checkIn is required"))
                    val checkOut = LocalDate.parse(item.checkOut ?: throw IllegalArgumentException("checkOut is required"))

                    val nights =
                        ChronoUnit.DAYS
                            .between(checkIn, checkOut)
                            .toInt()
                            .coerceAtLeast(1)
                    val standard = roomService.findStandard(room)
                    val pricePerNight = room.pricePerNight ?: standard.basePrice
                    val totalPrice = pricePerNight.times(nights)
                    val priceCents = (totalPrice.times(100)).toInt()
                    totalAmountCents += priceCents

                    itemDetails.add(
                        mapOf(
                            "id" to item.id,
                            "type" to "RESERVATION",
                            "name" to "Room ${room.number}",
                            "nights" to nights,
                            "pricePerNight" to pricePerNight,
                            "price" to totalPrice,
                            "priceCents" to priceCents,
                        ),
                    )
                }
                else -> throw IllegalArgumentException("Unknown item type: ${item.type}")
            }
        }

        if (totalAmountCents <= 0) {
            throw IllegalArgumentException("Invalid cart total")
        }

        val orderDescription = "Hotel Services Order (${request.cartItems.size} item${if (request.cartItems.size > 1) "s" else ""})"

        // TODO: Integrate with actual payment provider (Stripe, PayPal, etc.)
        // For now, return the calculated data
        return mapOf(
            "amountCents" to totalAmountCents,
            "currency" to request.currency,
            "orderDescription" to orderDescription,
            "items" to itemDetails,
            "successUrl" to request.successUrl,
            "cancelUrl" to request.cancelUrl,
            "customerEmail" to (request.customerEmail ?: ""),
        )
    }
}
