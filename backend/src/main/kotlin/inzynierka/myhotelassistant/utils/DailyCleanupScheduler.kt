package inzynierka.myhotelassistant.utils

import inzynierka.myhotelassistant.models.schedule.OrderStatus
import inzynierka.myhotelassistant.repositories.RegistrationCodeRepository
import inzynierka.myhotelassistant.repositories.ScheduleRepository
import inzynierka.myhotelassistant.services.notifications.NotificationService
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Component
import java.time.Instant
import java.time.LocalDateTime

@Component
class DailyCleanupScheduler(
    private val registrationCodeRepository: RegistrationCodeRepository,
    private val scheduleRepository: ScheduleRepository,
    private val notificationService: NotificationService,
) {
    private val logger = LoggerFactory.getLogger(DailyCleanupScheduler::class.java)

    @Value("\${app.notification.expiration.days:30}")
    private lateinit var notificationExpirationDays: Integer

    /**
     * Runs daily at 03:00:
     * 1) Removes expired registration codes.
     * 2) Deactivates guest accounts after check-out. (doesn't work anymore)
     * 3) Removes read notifications.
     * 4) Removes old available schedules.
     */
    @Scheduled(cron = "0 0 3 * * *")
    fun runDailyCleanup() {
        val now = Instant.now()
        logger.info("Daily cleaning starts at $now")

        var deletedCount = registrationCodeRepository.deleteByExpiresAtBefore(now)
        logger.info("Deleted $deletedCount expired registration codes")

//        deletedCount = userRepository.deleteByRoleAndCheckOutDateBefore(Role.GUEST, now)
//        if (deletedCount > 0) {
//            logger.info("Deleted $deletedCount expired guests accounts (till $now).")
//        }

        deletedCount = notificationService.removeReadNotifications(notificationExpirationDays)
        if (deletedCount > 0) {
            logger.info("Deleted $deletedCount expired notifications (till $now).")
        }

        deletedCount =
            scheduleRepository.deleteByStatusAndServiceDateBefore(
                status = OrderStatus.AVAILABLE,
                beforeDate = LocalDateTime.now(),
            )
        if (deletedCount > 0) {
            logger.info("Deleted $deletedCount old available schedules.")
        }
    }
}
