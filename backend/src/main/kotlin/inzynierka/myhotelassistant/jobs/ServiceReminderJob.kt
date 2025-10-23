package inzynierka.myhotelassistant.jobs

import inzynierka.myhotelassistant.models.notification.NotificationVariant
import inzynierka.myhotelassistant.models.schedule.OrderStatus
import inzynierka.myhotelassistant.repositories.ScheduleRepository
import inzynierka.myhotelassistant.services.notifications.NotificationService
import inzynierka.myhotelassistant.services.ServiceService
import org.slf4j.LoggerFactory
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Component
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter
import java.util.concurrent.ConcurrentHashMap

@Component
class ServiceReminderJob(
    private val scheduleRepository: ScheduleRepository,
    private val notificationService: NotificationService,
    private val serviceService: ServiceService,
) {
    private val logger = LoggerFactory.getLogger(ServiceReminderJob::class.java)
    private val notifiedSchedules = ConcurrentHashMap.newKeySet<String>()
    private val dateFormatter = DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm")

    @Scheduled(fixedRate = 600000) // Every 10 minutes (600,000 milliseconds)
    fun checkUpcomingServices() {
        logger.info("Running service reminder check...")

        val now = LocalDateTime.now()
        val oneHourLater = now.plusHours(1)

        // Find schedules that are active or requested and starting within the next hour
        val upcomingSchedules = scheduleRepository.findByStatusInAndServiceDateBetween(
            statuses = listOf(OrderStatus.ACTIVE, OrderStatus.REQUESTED),
            startDate = now,
            endDate = oneHourLater
        )

        logger.info("Found ${upcomingSchedules.size} upcoming services")

        upcomingSchedules.forEach { schedule ->
            // Skip if schedule has no id, already notified or no guest assigned
            if (schedule.id == null || schedule.id in notifiedSchedules || schedule.guestId == null) {
                return@forEach
            }

            try {
                val service = serviceService.findByIdOrThrow(schedule.serviceId)
                val minutesUntil = java.time.Duration.between(now, schedule.serviceDate).toMinutes()

                val title = "Upcoming Service Reminder"
                val message = "Your service '${service.name}' is scheduled to start in approximately $minutesUntil minutes at ${schedule.serviceDate.format(dateFormatter)}."

                notificationService.addNotificationToUser(
                    userId = schedule.guestId!!,
                    title = title,
                    variant = NotificationVariant.NOTICE,
                    message = message
                )

                // Mark as notified
                schedule.id?.let { notifiedSchedules.add(it) }
                logger.info("Sent reminder notification for schedule ${schedule.id} to guest ${schedule.guestId}")
            } catch (e: Exception) {
                logger.error("Error sending reminder for schedule ${schedule.id}: ${e.message}", e)
            }
        }

        // Clean up notified schedules that are in the past
        cleanupOldNotifications(now)
    }

    private fun cleanupOldNotifications(now: LocalDateTime) {
        val iterator = notifiedSchedules.iterator()
        while (iterator.hasNext()) {
            val scheduleId = iterator.next()
            try {
                val schedule = scheduleRepository.findById(scheduleId)
                if (schedule.isEmpty || schedule.get().serviceDate.isBefore(now)) {
                    iterator.remove()
                }
            } catch (e: Exception) {
                // If schedule not found, remove from set
                iterator.remove()
            }
        }
    }
}
