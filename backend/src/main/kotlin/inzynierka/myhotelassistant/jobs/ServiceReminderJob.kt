package inzynierka.myhotelassistant.jobs

import inzynierka.myhotelassistant.models.notification.NotificationVariant
import inzynierka.myhotelassistant.models.schedule.OrderStatus
import inzynierka.myhotelassistant.repositories.ScheduleRepository
import inzynierka.myhotelassistant.services.ServiceService
import inzynierka.myhotelassistant.services.notifications.NotificationService
import org.slf4j.LoggerFactory
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Component
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter
import java.util.concurrent.ConcurrentHashMap
import java.util.concurrent.TimeUnit

@Component
class ServiceReminderJob(
    private val scheduleRepository: ScheduleRepository,
    private val notificationService: NotificationService,
    private val serviceService: ServiceService,
) {
    private val logger = LoggerFactory.getLogger(ServiceReminderJob::class.java)
    private val notifiedSchedulesServiceDateMap = ConcurrentHashMap<String, LocalDateTime>()
    private val dateFormatter = DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm")

    @Scheduled(timeUnit = TimeUnit.MINUTES, fixedRate = 10)
    fun checkUpcomingServices() {
        logger.info("Running service reminder check...")

        val now = LocalDateTime.now()
        val oneHourLater = now.plusHours(1)

        val upcomingSchedules =
            scheduleRepository.findByStatusInAndServiceDateBetween(
                statuses = listOf(OrderStatus.ACTIVE, OrderStatus.REQUESTED),
                startDate = now,
                endDate = oneHourLater,
            )

        logger.info("Found ${upcomingSchedules.size} upcoming services")

        upcomingSchedules.forEach { schedule ->
            if (schedule.id in notifiedSchedulesServiceDateMap.keys || schedule.guestId == null) {
                return@forEach
            }

            try {
                val service = serviceService.findByIdOrThrow(schedule.serviceId)
                val minutesUntil =
                    java.time.Duration
                        .between(now, schedule.serviceDate)
                        .toMinutes()

                val title = "Upcoming Service Reminder"
                val message =
                    "Your service '${service.name}' is scheduled to start in approximately " +
                        "$minutesUntil minutes at ${schedule.serviceDate.format(dateFormatter)}."

                notificationService.addNotificationToUser(
                    userId = schedule.guestId!!,
                    title = title,
                    variant = NotificationVariant.NOTICE,
                    message = message,
                )

                notifiedSchedulesServiceDateMap[schedule.id!!] = schedule.serviceDate
                logger.info("Sent reminder notification for schedule ${schedule.id} to guest ${schedule.guestId}")
            } catch (e: Exception) {
                logger.error("Error sending reminder for schedule ${schedule.id}: ${e.message}", e)
            }
        }

        cleanupOldNotifications(now)
    }

    private fun cleanupOldNotifications(now: LocalDateTime) {
        notifiedSchedulesServiceDateMap.entries.removeIf { it.value.isBefore(now) }
    }
}
