package inzynierka.myhotelassistant.utils

import org.springframework.mail.SimpleMailMessage
import org.springframework.mail.javamail.JavaMailSender
import org.springframework.stereotype.Service
import java.time.Instant

@Service
class EmailSender(
    private val mailSender: JavaMailSender
) {

    fun sendRegistrationCodeEmail(email: String, code: String, validUntil: Instant) {
        // TODO: Add email template
        val msg = SimpleMailMessage().apply {
            from = "hello@demomailtrap.co"
            setTo(email)
            subject = "Your registration code"
            text = """
                        Welcome,
        
                        Your registration code to MyHotelAssistant app:
                        $code
        
                        Code is valid until: $validUntil
        
                        Best regards,
                        MyHotelAssistant Team
                    """.trimIndent()
        }
        mailSender.send(msg)
    }
}