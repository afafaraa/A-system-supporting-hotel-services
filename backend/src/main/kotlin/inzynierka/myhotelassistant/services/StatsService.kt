package inzynierka.myhotelassistant.services

import inzynierka.myhotelassistant.models.reservation.ReservationStatus
import inzynierka.myhotelassistant.repositories.ReservationsRepository
import inzynierka.myhotelassistant.repositories.ScheduleRepository
import org.springframework.stereotype.Service
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.LocalTime

@Service
class StatsService(
    private val scheduleRepository: ScheduleRepository,
    private val reservationsRepository: ReservationsRepository,
) {
    data class ServiceStat(
        val id: Int,
        val name: String,
        val orderCount: Long? = null,
        val revenue: String? = null,
    )

    fun getStats(): List<ServiceStat> {
        val today = LocalDate.now()
        val startOfDay: LocalDateTime = today.atStartOfDay()
        val endOfDay: LocalDateTime = today.atTime(LocalTime.MAX)

        val bookingsToday =
            scheduleRepository
                .countAllByOrderTimeBetween(startOfDay, endOfDay)

        val checkInsToday =
            reservationsRepository
                .countAllByCheckInIs(today)

        val guestsToday =
            reservationsRepository
                .countAllByStatus(ReservationStatus.CHECKED_IN)

        val totalRevenue =
            (reservationsRepository.sumReservationPriceByPaidIsTrue() ?: 0.0) +
                (scheduleRepository.sumPriceWhereNotNull() ?: 0.0)

        return listOf(
            ServiceStat(id = 1, name = "bookings_today", orderCount = bookingsToday),
            ServiceStat(id = 2, name = "check_ins", orderCount = checkInsToday),
            ServiceStat(id = 3, name = "revenue", revenue = String.format("%.2f", totalRevenue)),
            ServiceStat(id = 4, name = "total_guests", orderCount = guestsToday),
        )
    }
}
