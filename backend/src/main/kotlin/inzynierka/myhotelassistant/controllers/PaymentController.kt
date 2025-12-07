package inzynierka.myhotelassistant.controllers

import com.fasterxml.jackson.databind.ObjectMapper
import com.stripe.Stripe
import com.stripe.exception.SignatureVerificationException
import com.stripe.model.Event
import com.stripe.model.checkout.Session
import com.stripe.net.Webhook
import com.stripe.param.checkout.SessionCreateParams
import inzynierka.myhotelassistant.dto.OrderRequest
import inzynierka.myhotelassistant.exceptions.HttpException
import inzynierka.myhotelassistant.models.PaymentSessionIdWithOrderEntity
import inzynierka.myhotelassistant.models.service.ReservationsService
import inzynierka.myhotelassistant.services.OrderService
import inzynierka.myhotelassistant.services.PaymentService
import inzynierka.myhotelassistant.services.PaymentSessionIdWithOrderService
import inzynierka.myhotelassistant.services.UserService
import jakarta.annotation.PostConstruct
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestHeader
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController
import java.security.Principal

@RestController
@RequestMapping("/payment")
class PaymentController(
    private val paymentService: PaymentService,
    private val userService: UserService,
    private val orderService: OrderService,
    private val paymentSessionService: PaymentSessionIdWithOrderService,
    private val reservationsService: ReservationsService,
) {
    @Value("\${stripe.api.key:}")
    private lateinit var stripeApiKey: String

    @Value("\${stripe.webhook.secret:}")
    private lateinit var webhookSecret: String

    private val logger = LoggerFactory.getLogger(PaymentController::class.java)

    @PostConstruct
    fun init() {
        Stripe.apiKey = stripeApiKey
    }

    data class CheckoutRequest(
        val cartItems: OrderRequest,
        val currency: String = "usd",
        val successUrl: String,
        val cancelUrl: String,
        val customerEmail: String?,
    )

    data class CreateCheckoutSessionResponse(
        val url: String,
        val sessionId: String,
    )

    @PostMapping("/create-checkout-session")
    @ResponseStatus(HttpStatus.CREATED)
    fun createCheckoutSession(
        principal: Principal,
        @RequestBody req: CheckoutRequest,
    ): CreateCheckoutSessionResponse {
        try {
            val guest = userService.findByUsernameOrThrow(principal.name)
            val orderResult = orderService.makeOrderFromItems(guest, req.cartItems)

            val checkoutData = paymentService.createCheckoutSession(req)

            val amountCents = checkoutData["amountCents"] as Int
            val orderDescription = checkoutData["orderDescription"] as String

            if (amountCents <= 0) {
                throw HttpException.InvalidArgumentException("Amount must be greater than zero")
            }

            val paramsBuilder =
                SessionCreateParams
                    .builder()
                    .setMode(SessionCreateParams.Mode.PAYMENT)
                    .setSuccessUrl(req.successUrl)
                    .setCancelUrl(req.cancelUrl)
                    .addLineItem(
                        SessionCreateParams.LineItem
                            .builder()
                            .setQuantity(1L)
                            .setPriceData(
                                SessionCreateParams.LineItem.PriceData
                                    .builder()
                                    .setCurrency(req.currency)
                                    .setUnitAmount(amountCents.toLong())
                                    .setProductData(
                                        SessionCreateParams.LineItem.PriceData.ProductData
                                            .builder()
                                            .setName(orderDescription)
                                            .build(),
                                    ).build(),
                            ).build(),
                    )

            req.customerEmail?.let { email ->
                paramsBuilder.setCustomerEmail(email)
            }

            val params = paramsBuilder.build()
            val session = Session.create(params)

            paymentSessionService.saveFromOrderResult(
                paymentSessionId = session.id,
                guestId = guest.id!!,
                orderResult = orderResult,
            )

            return CreateCheckoutSessionResponse(
                url = session.url,
                sessionId = session.id,
            )
        } catch (e: Exception) {
            throw HttpException.InvalidArgumentException("Failed to create checkout session: ${e.message}")
        }
    }

    @PostMapping("/webhook")
    fun handleWebhook(
        @RequestBody payload: String,
        @RequestHeader("Stripe-Signature") sigHeader: String,
    ): ResponseEntity<String> {
        val event: Event =
            try {
                Webhook.constructEvent(payload, sigHeader, webhookSecret)
            } catch (_: SignatureVerificationException) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid signature")
            } catch (_: Exception) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Webhook error")
            }

        fun getSessionIdFromEvent(event: Event): String? {
            val rawJson = event.dataObjectDeserializer.rawJson
            val node = ObjectMapper().readTree(rawJson)
            val sessionId: String? = node.get("id").asText(null)
            if (sessionId == null || sessionId.isBlank()) {
                logger.error("No session id in event data for event id: ${event.id}")
                return null
            }
            return sessionId
        }

        fun deleteOrder(paymentSessionWithOrder: PaymentSessionIdWithOrderEntity) {
            val guest = userService.findByIdOrThrow(paymentSessionWithOrder.guestId)
            paymentSessionWithOrder.itemIds.scheduleIds.forEach { id ->
                orderService.cancel(guest, id)
            }
            try {
                reservationsService.unbindAndDeleteReservationsFromGuest(guest, paymentSessionWithOrder.itemIds.reservationIds)
            } catch (e: Exception) {
                logger.error("Failed to unbind reservations from guest [${paymentSessionWithOrder.guestId}]: ${e.message}")
            }
        }

        when (event.type) {
            "checkout.session.completed" -> {
                val sessionId =
                    getSessionIdFromEvent(event)
                        ?: return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid session data")
                val paymentSessionWithOrder = paymentSessionService.deletePaymentSessionById(sessionId)
                if (paymentSessionWithOrder == null) {
                    logger.error("No payment session found for session id: $sessionId")
                    return ResponseEntity.ok().body("Payment session not found (already processed or not found)")
                }
                orderService.setItemsAsPaid(
                    guestId = paymentSessionWithOrder.guestId,
                    itemIds = paymentSessionWithOrder.itemIds,
                )
                logger.debug("Payment succeeded for session id: $sessionId")
            }

            "checkout.session.expired" -> {
                val sessionId =
                    getSessionIdFromEvent(event)
                        ?: return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid session data")
                val paymentSessionWithOrder = paymentSessionService.deletePaymentSessionById(sessionId)
                paymentSessionWithOrder?.let { deleteOrder(it) }
                logger.debug("Payment session expired for session id: $sessionId")
            }

            "checkout.session.async_payment_failed" -> {
                val sessionId =
                    getSessionIdFromEvent(event)
                        ?: return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid session data")
                val paymentSessionWithOrder = paymentSessionService.deletePaymentSessionById(sessionId)
                paymentSessionWithOrder?.let { deleteOrder(it) }
                logger.debug("Async payment failed for session id: $sessionId")
            }

            else -> {
                logger.debug("Unknown payment event type: ${event.type} for session id: ${event.id}")
            }
        }

        return ResponseEntity.ok("Received")
    }
}
