package inzynierka.myhotelassistant.services

import inzynierka.myhotelassistant.exceptions.HttpException.InvalidRegistrationCodeException
import inzynierka.myhotelassistant.models.RegistrationCode
import inzynierka.myhotelassistant.repositories.RegistrationCodeRepository
import inzynierka.myhotelassistant.utils.email.EmailSender
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import java.time.Instant

@Service
class RegistrationCodeService(
    private val repo: RegistrationCodeRepository,
    private val mailSender: EmailSender,
) {
    private val logger = LoggerFactory.getLogger(RegistrationCodeService::class.java)

    fun generateAndSendForUser(
        userId: String,
        email: String,
        validUntil: Instant,
    ): String {
        val rawCode = generateCode()
        val rc = RegistrationCode(userId = userId, code = rawCode, expiresAt = validUntil)
        mailSender.sendRegistrationCodeEmail(email, rc.code, validUntil)
        repo.save(rc)
        logger.debug("Generated and send registration code {} to {}", rc, email)
        return rawCode
    }

    fun validateCode(rawCode: String): RegistrationCode =
        repo.findByCode(rawCode)?.takeIf { !it.used && it.expiresAt.isAfter(Instant.now()) }
            ?: throw InvalidRegistrationCodeException("Invalid or expired code!")

    fun markUsed(rc: RegistrationCode) {
        repo.delete(rc)
    }

    fun generateCode(length: Int = 5): String {
        val allowedChars = ('A'..'Z') + ('a'..'z') + ('0'..'9')
        return (1..length).map { allowedChars.random() }.joinToString("")
    }
}
