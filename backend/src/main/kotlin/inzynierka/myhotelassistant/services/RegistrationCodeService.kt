package inzynierka.myhotelassistant.services

import inzynierka.myhotelassistant.models.RegistrationCode
import inzynierka.myhotelassistant.repositories.RegistrationCodeRepository
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import java.time.Instant
import java.time.temporal.ChronoUnit

@Service
class RegistrationCodeService(
    private val repo: RegistrationCodeRepository,
    @Value("\${app.registration.code.ttl-hours:24}") private val ttlHours: Long
) {
    private val logger = LoggerFactory.getLogger(RegistrationCodeService::class.java)

    fun generateCodeForUser(userId: String): String {
        val rawCode = generateCode()
        val rc = RegistrationCode(
            userId    = userId,
            code      = rawCode,
            expiresAt = Instant.now().plus(ttlHours, ChronoUnit.HOURS)
        )
        repo.save(rc)
        logger.info("Wygenerowany kod rejestracyjny dla userId=${userId}: $rawCode")
        return rawCode
    }

    fun validateCode(rawCode: String): RegistrationCode =
        repo.findByCode(rawCode)
            ?.takeIf { !it.used && it.expiresAt.isAfter(Instant.now()) }
            ?: throw IllegalArgumentException("Nieprawidłowy lub wygasły kod")

    fun markUsed(rc: RegistrationCode) {
        rc.used = true
        repo.save(rc)
    }
    fun generateCode(length: Int = 5): String {
        val allowedChars = ('A'..'Z') + ('a'..'z') + ('0'..'9')
        return (1..length)
            .map { allowedChars.random() }
            .joinToString("")
    }
}