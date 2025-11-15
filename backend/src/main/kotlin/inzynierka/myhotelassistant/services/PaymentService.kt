package inzynierka.myhotelassistant.services

import inzynierka.myhotelassistant.controllers.PaymentController.CheckoutRequest
import inzynierka.myhotelassistant.models.service.ReservationsService
import org.springframework.stereotype.Service
import java.time.temporal.ChronoUnit

@Service
class PaymentService(
    private val scheduleService: ScheduleService,
    private val serviceService: ServiceService,
    private val roomService: RoomService,
    private val reservationsService: ReservationsService,
) {
    fun createCheckoutSession(request: CheckoutRequest): Map<String, Any> {
        val itemsCount = request.cartItems.schedules.size + request.cartItems.reservations.size
        if (itemsCount == 0) {
            throw IllegalArgumentException("Cart is empty")
        }

        var totalAmountCents = 0
        val itemDetails = mutableListOf<Map<String, Any>>()

        request.cartItems.schedules.forEach { item ->
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

        request.cartItems.reservations.forEach { item ->
            val room = roomService.findRoomByNumber(item.roomNumber)
            val roomStandard = roomService.findStandardById(room.standardId)
            val totalPrice = reservationsService.calculateReservationPrice(item.roomNumber, item.checkIn, item.checkOut)
            val priceCents = (totalPrice.times(100)).toInt()
            totalAmountCents += priceCents

            itemDetails.add(
                mapOf(
                    "id" to room.number,
                    "type" to "RESERVATION",
                    "name" to "Room ${room.number}",
                    "nights" to ChronoUnit.DAYS.between(item.checkIn, item.checkOut),
                    "pricePerNight" to (room.pricePerNight ?: roomStandard.basePrice),
                    "price" to totalPrice,
                    "priceCents" to priceCents,
                ),
            )
        }
        require(totalAmountCents > 0) { "Invalid cart total" }

        val orderDescription = "Hotel Services Order ($itemsCount item${if (itemsCount > 1) "s" else ""})"

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
