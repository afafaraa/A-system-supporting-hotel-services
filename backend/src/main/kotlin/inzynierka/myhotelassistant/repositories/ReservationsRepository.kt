package inzynierka.myhotelassistant.repositories

import inzynierka.myhotelassistant.models.reservation.ReservationEntity
import inzynierka.myhotelassistant.models.reservation.ReservationStatus
import org.springframework.data.mongodb.repository.Aggregation
import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.data.mongodb.repository.Query
import java.time.LocalDate
import java.time.LocalDateTime

interface ReservationsRepository : MongoRepository<ReservationEntity, String> {
    fun existsByRoomNumberAndCheckInLessThanAndCheckOutGreaterThanAndBlocksRoomIsTrue(
        roomNumber: String,
        checkOut: LocalDate,
        checkIn: LocalDate,
    ): Boolean

    fun findAllByStatus(status: ReservationStatus): List<ReservationEntity>

    fun findAllByGuestIdOrderByCreatedAtDesc(guestId: String): List<ReservationEntity>

    fun findAllByGuestId(guestId: String): List<ReservationEntity>

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

    fun findAllByCheckInIsBetweenAndStatusIs(
        checkInAfter: LocalDate,
        checkInBefore: LocalDate,
        status: ReservationStatus,
    ): List<ReservationEntity>

    fun countAllByCheckInIs(checkInDate: LocalDate): Long

    fun countAllByStatus(status: ReservationStatus): Long

    @Aggregation(
        pipeline = [
            "{ '\$match': { 'paid': true } }",
            "{ '\$group': { '_id': null, 'total': { '\$sum': '\$reservationPrice' } } }",
            "{ '\$project': { '_id': 0, 'total': 1 } }",
        ],
    )
    fun sumReservationPriceByPaidIsTrue(): Double?

    @Aggregation(
        pipeline = [
            "{ '\$match': { 'checkIn': { '\$gte': { '\$date': '?0' }, '\$lte': { '\$date': '?1' } }, 'paid': true } }",
            "{ '\$group': { '_id': null, 'total': { '\$sum': '\$reservationPrice' } } }",
            "{ '\$project': { '_id': 0, 'total': 1 } }",
        ],
    )
    fun sumReservationPriceByCheckInBetweenAndPaidIsTrue(
        startDate: LocalDate,
        endDate: LocalDate,
    ): Double?

    fun countAllByCreatedAtBetween(
        startDate: LocalDateTime,
        endDate: LocalDateTime,
    ): Long

    @Query(
        "{ '\$or': [ " +
            "{ 'checkIn': { '\$gte': ?0, '\$lte': ?1 } }, " +
            "{ 'checkOut': { '\$gte': ?0, '\$lte': ?1 } }, " +
            "{ 'checkIn': { '\$lt': ?0 }, 'checkOut': { '\$gt': ?1 } } " +
            "] }",
    )
    fun findAllByOverlappingDates(
        startDate: LocalDate,
        endDate: LocalDate,
    ): List<ReservationEntity>

    fun countByCheckInLessThanEqualAndCheckOutGreaterThan(
        date: LocalDate,
        datePlusOne: LocalDate,
    ): Long

    fun countAllByCheckInIsAndStatusIs(
        checkInDate: LocalDate,
        status: ReservationStatus,
    ): Long

    fun countAllByCheckOutIsAndStatusIs(
        checkOutDate: LocalDate,
        status: ReservationStatus,
    ): Long

    fun countAllByCheckInIsBetweenAndStatusIs(
        checkInAfter: LocalDate,
        checkInBefore: LocalDate,
        status: ReservationStatus,
    ): Long
}
