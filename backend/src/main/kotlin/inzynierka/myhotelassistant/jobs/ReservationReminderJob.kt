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

@Component
class ReservationReminderJob(
    private val reservationsRepository: ReservationsRepository,
    private val notificationService: NotificationService,
) {
    private val logger = LoggerFactory.getLogger(ReservationReminderJob::class.java)
    private val notifiedReservations = ConcurrentHashMap.newKeySet<String>()
    private val dateFormatter = DateTimeFormatter.ofPattern("dd.MM.yyyy")

    @Scheduled(fixedRate = 3600000) // Every hour (3,600,000 milliseconds)
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
            if (reservation.id == null || reservation.id in notifiedReservations) {
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

                reservation.id?.let { notifiedReservations.add(it) }
                logger.info("Sent reminder notification for reservation ${reservation.id} to guest ${reservation.guestId}")
            } catch (e: Exception) {
                logger.error("Error sending reminder for reservation ${reservation.id}: ${e.message}", e)
            }
        }

        cleanupOldNotifications(today)
    }

    private fun cleanupOldNotifications(today: LocalDate) {
        val iterator = notifiedReservations.iterator()
        while (iterator.hasNext()) {
            val reservationId = iterator.next()
            try {
                val reservation = reservationsRepository.findById(reservationId)
                if (reservation.isEmpty || reservation.get().checkIn.isBefore(today)) {
                    iterator.remove()
                }
            } catch (e: Exception) {
                iterator.remove()
            }
        }
    }
}
