package inzynierka.myhotelassistant.services

import inzynierka.myhotelassistant.exceptions.HttpException
import inzynierka.myhotelassistant.models.RegistrationCode
import inzynierka.myhotelassistant.repositories.RegistrationCodeRepository
import org.slf4j.LoggerFactory
import org.springframework.mail.SimpleMailMessage
import org.springframework.mail.javamail.JavaMailSender
import org.springframework.stereotype.Service
import java.time.Instant

@Service
class RegistrationCodeService(
    private val repo: RegistrationCodeRepository, private val mailSender: JavaMailSender
) {
    private val logger = LoggerFactory.getLogger(RegistrationCodeService::class.java)


    fun generateAndSendForUser(userId: String, email: String, validUntil: Instant): String {
        val rawCode = generateCode()
        val rc = RegistrationCode(
            userId = userId, code = rawCode, expiresAt = validUntil
        )
        repo.save(rc)
        val msg = SimpleMailMessage().apply {
            from = "hello@demomailtrap.co"
            setTo(email)
            subject = "Twój kod rejestracyjny"
            text = """
                        Witaj,
        
                        Twój kod rejestracyjny do MyHotelAssistant:
                        ${rc.code}
        
                        Kod ważny do: $validUntil
        
                        Pozdrawiamy,
                        Zespół MyHotelAssistant
                    """.trimIndent()
        }
        mailSender.send(msg)
        logger.info("Generated and send RegistrationCode {} to {}", rc, email)
        return rawCode
    }

    fun validateCode(rawCode: String): RegistrationCode =
        repo.findByCode(rawCode)?.takeIf { !it.used && it.expiresAt.isAfter(Instant.now()) }
            ?: throw HttpException.InvalidRegistrationCodeException("Invalid or expired code!")

    fun markUsed(rc: RegistrationCode) {
        rc.used = true
        repo.save(rc)
    }

    fun generateCode(length: Int = 5): String {
        val allowedChars = ('A'..'Z') + ('a'..'z') + ('0'..'9')
        return (1..length).map { allowedChars.random() }.joinToString("")
    }


}