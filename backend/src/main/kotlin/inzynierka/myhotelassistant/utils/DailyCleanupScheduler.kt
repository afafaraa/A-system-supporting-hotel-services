package inzynierka.myhotelassistant.utils

import inzynierka.myhotelassistant.models.Role
import inzynierka.myhotelassistant.repositories.RegistrationCodeRepository
import inzynierka.myhotelassistant.repositories.UserRepository
import org.slf4j.LoggerFactory
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Component
import java.time.Instant

@Component
class DailyCleanupScheduler(
    private val registrationCodeRepository: RegistrationCodeRepository,
    private val userRepository: UserRepository
) {
    private val logger = LoggerFactory.getLogger(DailyCleanupScheduler::class.java)

    /**
     * Uruchamiane codziennie o 03:00:
     * 1) Usuwa przeterminowane kody rejestracyjne.
     * 2) Dezaktywuje konta gości po wymeldowaniu.
     */
    @Scheduled(cron = "0 0 3 * * *")
    fun runDailyCleanup() {
        val now = Instant.now()
        logger.info("Rozpoczęcie codziennego sprzątania o $now")

        val codesDeleted = registrationCodeRepository.deleteByExpiresAtBefore(now)
        logger.info("Usunięto $codesDeleted przeterminowanych kodów rejestracyjnych")

        val expiredGuests = userRepository.findAll().filter { user ->
            user.role == Role.GUEST &&
                    user.checkOutDate?.isBefore(now) == true
        }

        expiredGuests.forEach { user ->
            userRepository.save(user)
        }
        logger.info("Dezaktywowano ${expiredGuests.size} kont gości po wymeldowaniu")
    }
}