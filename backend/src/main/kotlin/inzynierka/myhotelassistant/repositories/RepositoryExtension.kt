package inzynierka.myhotelassistant.repositories

import org.springframework.stereotype.Component
import java.time.LocalDate
import java.time.temporal.ChronoUnit

@Component
class RepositoryExtensions(
    private val reservationsRepository: ReservationsRepository,
) {
    fun sumOccupiedRoomDaysBetween(
        startDate: LocalDate,
        endDate: LocalDate,
    ): Int {
        val overlappingReservations = reservationsRepository.findAllByOverlappingDates(
            startDate,
            endDate,
        )

        return overlappingReservations.sumOf { reservation ->
            val effectiveStart = maxOf(reservation.checkIn, startDate)
            val effectiveEnd = minOf(reservation.checkOut, endDate.plusDays(1))

            ChronoUnit.DAYS.between(effectiveStart, effectiveEnd).toInt().coerceAtLeast(0)
        }
    }

    fun countOccupiedRoomsOnDate(date: LocalDate): Long {
        return reservationsRepository.countByCheckInLessThanEqualAndCheckOutGreaterThan(
            date,
            date.plusDays(1),
        )
    }
}