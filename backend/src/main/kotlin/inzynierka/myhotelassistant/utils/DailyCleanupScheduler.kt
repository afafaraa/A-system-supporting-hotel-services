package inzynierka.myhotelassistant.utils

import inzynierka.myhotelassistant.models.user.Role
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
     * Runs daily at 03:00:
     * 1) Removes expired registration codes.
     * 2) Deactivates guest accounts after check-out.
     */
    @Scheduled(cron = "0 0 3 * * *")
    fun runDailyCleanup() {
        val now = Instant.now()
        logger.info("Daily cleaning starts at $now")

        val codesDeleted = registrationCodeRepository.deleteByExpiresAtBefore(now)
        logger.info("Deleted $codesDeleted expired registration codes")

        val deletedCount = userRepository.deleteByRoleAndCheckOutDateBefore(Role.GUEST, now)
        if (deletedCount > 0) {
            logger.info("Deleted $deletedCount expired guests accounts (till $now).")
        }
    }
}
