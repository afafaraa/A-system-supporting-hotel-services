package inzynierka.myhotelassistant.jobs

import inzynierka.myhotelassistant.models.notification.NotificationVariant
import inzynierka.myhotelassistant.models.reservation.ReservationStatus
import inzynierka.myhotelassistant.repositories.ReservationsRepository
import inzynierka.myhotelassistant.services.notifications.NotificationService
import org.slf4j.LoggerFactory
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Component
import java.time.LocalDate
import java.time.format.DateTimeFormatter
import java.util.concurrent.ConcurrentHashMap
import java.util.concurrent.TimeUnit

@Component
class ReservationReminderJob(
    private val reservationsRepository: ReservationsRepository,
    private val notificationService: NotificationService,
) {
    private val logger = LoggerFactory.getLogger(ReservationReminderJob::class.java)
    private val notifiedReservationsCheckInMap = ConcurrentHashMap<String, LocalDate>()
    private val dateFormatter = DateTimeFormatter.ofPattern("dd.MM.yyyy")

    @Scheduled(timeUnit = TimeUnit.HOURS, fixedRate = 1)
    fun checkUpcomingReservations() {
        logger.info("Running reservation reminder check...")

        val today = LocalDate.now()
        val tomorrow = today.plusDays(1)

        val upcomingReservations =
            reservationsRepository.findAllByCheckInIsBetweenAndStatusIs(
                checkInAfter = today,
                checkInBefore = tomorrow.plusDays(1),
                status = ReservationStatus.CONFIRMED,
            )

        logger.info("Found ${upcomingReservations.size} upcoming reservations within 24 hours")

        upcomingReservations.forEach { reservation ->
            if (reservation.id in notifiedReservationsCheckInMap.keys) {
                return@forEach
            }

            try {
                val title = "Upcoming Check-In Reminder"
                val message =
                    "Your reservation for room ${reservation.roomNumber} is coming up! " +
                        "Check-in date: ${reservation.checkIn.format(dateFormatter)}. " +
                        "We look forward to welcoming you!"

                notificationService.addNotificationToUser(
                    userId = reservation.guestId,
                    title = title,
                    variant = NotificationVariant.NOTICE,
                    message = message,
                )

                notifiedReservationsCheckInMap[reservation.id!!] = reservation.checkIn
                logger.info("Sent reminder notification for reservation ${reservation.id} to guest ${reservation.guestId}")
            } catch (e: Exception) {
                logger.error("Error sending reminder for reservation ${reservation.id}: ${e.message}", e)
            }
        }

        cleanupOldNotifications(today)
    }

    private fun cleanupOldNotifications(today: LocalDate) {
        notifiedReservationsCheckInMap.entries.removeIf { it.value.isBefore(today) }
    }
}
