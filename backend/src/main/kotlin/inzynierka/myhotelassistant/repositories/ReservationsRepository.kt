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

    fun findAllByCheckInIsAndStatusIs(
        checkIn: LocalDate,
        status: ReservationStatus,
    ): List<ReservationEntity>

    fun findAllByCheckOutIsAndStatusIs(
        checkOut: LocalDate,
        status: ReservationStatus,
    ): List<ReservationEntity>

    fun findAllByCheckInIsBetweenAndStatusInOrderByCheckIn(
        checkInAfter: LocalDate,
        checkInBefore: LocalDate,
        statuses: List<ReservationStatus>,
    ): List<ReservationEntity>

    fun findAllByCheckOutIsBetweenAndStatusIsOrderByCheckOut(
        checkOutAfter: LocalDate,
        checkOutBefore: LocalDate,
        status: ReservationStatus,
    ): List<ReservationEntity>

    fun findAllByCheckInIsBeforeAndStatusIsIn(
        checkInDate: LocalDate,
        statuses: List<ReservationStatus>,
    ): List<ReservationEntity>

    fun countAllByCheckInIsBeforeAndStatusIsIn(
        checkInDate: LocalDate,
        statuses: List<ReservationStatus>,
    ): Long

    fun findAllByCheckOutIsBeforeAndStatusIsIn(
        checkOutDate: LocalDate,
        statuses: List<ReservationStatus>,
    ): List<ReservationEntity>

    fun countAllByCheckOutIsBeforeAndStatusIsIn(
        checkOutDate: LocalDate,
        statuses: List<ReservationStatus>,
    ): Long
}
