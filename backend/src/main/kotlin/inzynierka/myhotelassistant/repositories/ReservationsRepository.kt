package inzynierka.myhotelassistant.repositories

import inzynierka.myhotelassistant.models.reservation.ReservationEntity
import inzynierka.myhotelassistant.models.reservation.ReservationStatus
import org.springframework.data.mongodb.repository.MongoRepository
import java.time.LocalDate

interface ReservationsRepository : MongoRepository<ReservationEntity, String> {
    fun existsByRoomNumberAndCheckInLessThanAndCheckOutGreaterThanAndBlocksRoomIsTrue(
        roomNumber: String,
        checkOut: LocalDate,
        checkIn: LocalDate,
    ): Boolean

    fun findAllByStatus(status: ReservationStatus): List<ReservationEntity>

    fun findAllByGuestIdOrderByCreatedAtDesc(guestId: String): List<ReservationEntity>
}
