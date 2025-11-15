package inzynierka.myhotelassistant.controllers

import com.stripe.Stripe
import com.stripe.model.checkout.Session
import com.stripe.param.checkout.SessionCreateParams
import inzynierka.myhotelassistant.dto.OrderRequest
import inzynierka.myhotelassistant.exceptions.HttpException
import inzynierka.myhotelassistant.services.PaymentService
import jakarta.annotation.PostConstruct
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/payment")
class PaymentController(
    private val paymentService: PaymentService,
) {
    @Value("\${stripe.api.key:}")
    private lateinit var stripeApiKey: String

    @PostConstruct
    fun init() {
        Stripe.apiKey = stripeApiKey
    }

    data class CreateCheckoutSessionResponse(
        val url: String,
        val sessionId: String,
    )

    @PostMapping("/create-checkout-session")
    @ResponseStatus(HttpStatus.CREATED)
    fun createCheckoutSession(
        @RequestBody req: CheckoutRequest,
    ): CreateCheckoutSessionResponse {
        try {
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

            return CreateCheckoutSessionResponse(
                url = session.url,
                sessionId = session.id,
            )
        } catch (e: Exception) {
            throw HttpException.InvalidArgumentException("Failed to create checkout session: ${e.message}")
        }
    }

    data class CheckoutRequest(
        val cartItems: OrderRequest,
        val currency: String = "usd",
        val successUrl: String,
        val cancelUrl: String,
        val customerEmail: String?,
    )
}
