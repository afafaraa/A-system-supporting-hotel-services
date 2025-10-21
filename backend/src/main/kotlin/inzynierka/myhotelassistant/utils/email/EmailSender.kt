package inzynierka.myhotelassistant.utils.email

import inzynierka.myhotelassistant.configs.AppProperties
import org.springframework.mail.SimpleMailMessage
import org.springframework.mail.javamail.JavaMailSender
import org.springframework.stereotype.Service
import java.net.URLEncoder
import java.nio.charset.StandardCharsets
import java.time.Instant

@Service
class EmailSender(
    private val mailSender: JavaMailSender,
    private val appProperties: AppProperties,
) {
    private val sendEmailAddress = "hello@demomailtrap.co"

    fun sendRegistrationCodeEmail(
        email: String,
        code: String,
        validUntil: Instant,
    ) {
        // TODO: Add email template
        val text = """
            Welcome,

            Your registration code to MyHotelAssistant app:
            $code

            Code is valid until: $validUntil

            Best regards,
            MyHotelAssistant Team
                    """

        val msg =
            SimpleMailMessage().apply {
                from = sendEmailAddress
                setTo(email)
                subject = "Your registration code"
                this.text = text.trimIndent()
            }
        mailSender.send(msg)
    }

    fun sendResetPasswordLink(
        email: String,
        link: String,
    ) {
        val text = """
            Hello,
    
            You have requested a password reset. Please click the link below to reset your password:
    
            $link
    
            If you did not request this, please ignore this email.
    
            Best regards,
            MyHotelAssistant Team
                    """

        val msg =
            SimpleMailMessage().apply {
                from = sendEmailAddress
                setTo(email)
                subject = "Password Reset Request"
                this.text = text.trimIndent()
            }
        mailSender.send(msg)
    }

    fun sendVerificationEmail(
        email: String,
        token: String,
    ) {
        val encodedToken = URLEncoder.encode(token, StandardCharsets.UTF_8.toString())
        val link = "${appProperties.frontend.url}/verify/account?token=$encodedToken"

        val text = """
            Hello,
    
            Please confirm your email by clicking the link below:
    
            $link
    
            This link is valid for 24 hours.
    
            Best regards,
            MyHotelAssistant Team
        """

        val msg =
            SimpleMailMessage().apply {
                from = sendEmailAddress
                setTo(email)
                subject = "Confirm your MyHotelAssistant account"
                this.text = text.trimIndent()
            }
        println("Verification link: $link")
        mailSender.send(msg)
    }
}
