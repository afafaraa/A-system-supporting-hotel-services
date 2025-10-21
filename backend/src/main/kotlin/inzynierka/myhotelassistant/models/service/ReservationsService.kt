package inzynierka.myhotelassistant.models.service

import com.fasterxml.jackson.annotation.JsonUnwrapped
import inzynierka.myhotelassistant.controllers.ReservationsController
import inzynierka.myhotelassistant.models.reservation.ReservationEntity
import inzynierka.myhotelassistant.models.reservation.ReservationStatus
import inzynierka.myhotelassistant.models.room.RoomEntity
import inzynierka.myhotelassistant.repositories.ReservationsRepository
import inzynierka.myhotelassistant.repositories.RoomRepository
import inzynierka.myhotelassistant.services.UserService
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import java.time.LocalDate
import java.time.temporal.ChronoUnit

@Service
class ReservationsService(
    private val reservationsRepository: ReservationsRepository,
    private val userService: UserService,
    private val roomRepository: RoomRepository,
) {
    private val possibleCancellationStatus = listOf(ReservationStatus.REQUESTED, ReservationStatus.CONFIRMED)

    @Value("\${app.reservations.cancellation.days-before}")
    private lateinit var cancellationDaysBefore: Integer

    data class ReservationWithRoomDTO(
        @field:JsonUnwrapped
        val reservation: ReservationEntity,
        val room: RoomEntity,
    )

    fun findByIdOrThrow(reservationId: String): ReservationEntity =
        reservationsRepository
            .findById(reservationId)
            .orElseThrow { IllegalArgumentException("Reservation with id $reservationId not found") }

    fun isRoomAvailable(
        roomNumber: String,
        from: LocalDate,
        to: LocalDate,
    ): Boolean =
        !reservationsRepository.existsByRoomNumberAndCheckInLessThanAndCheckOutGreaterThanAndBlocksRoomIsTrue(
            roomNumber = roomNumber,
            checkOut = to,
            checkIn = from,
        )

    fun getAllReservationsWithStatus(status: String): List<ReservationsController.ReservationDTO> {
        val parsedStatus = ReservationStatus.fromString(status)
        return reservationsRepository
            .findAllByStatus(parsedStatus)
            .map { reservation ->
                val guest = userService.getUserNameAndEmailById(reservation.guestId)
                val room =
                    roomRepository.getRoomStandardByNumber(reservation.roomNumber)
                        ?: throw IllegalArgumentException("Room with number ${reservation.roomNumber} not found")
                ReservationsController.ReservationDTO(
                    reservation,
                    "${guest?.name} ${guest?.surname}",
                    guest?.email,
                    room.standard.displayName,
                )
            }
    }

    fun createReservation(reservationDTO: ReservationsController.ReservationCreateDTO): ReservationEntity {
        if (!reservationDTO.checkIn.isBefore(reservationDTO.checkOut)) {
            throw IllegalArgumentException("Check-in date must be before check-out date")
        }
        if (reservationDTO.checkIn.isBefore(LocalDate.now())) {
            throw IllegalArgumentException("Check-in date must be in the future")
        }
        if (!isRoomAvailable(reservationDTO.roomNumber, reservationDTO.checkIn, reservationDTO.checkOut)) {
            throw IllegalArgumentException(
                "Room ${reservationDTO.roomNumber} is not available from ${reservationDTO.checkIn} to ${reservationDTO.checkOut}",
            )
        }
        val guest = userService.findByUsernameOrThrow(reservationDTO.guestUsername)
        val reservationPrice = calculateReservationPrice(reservationDTO.roomNumber, reservationDTO.checkIn, reservationDTO.checkOut)
        val reservation =
            ReservationEntity(
                roomNumber = reservationDTO.roomNumber,
                guestId = guest.id!!,
                guestsCount = reservationDTO.guestsCount,
                checkIn = reservationDTO.checkIn,
                checkOut = reservationDTO.checkOut,
                reservationPrice = reservationPrice,
                specialRequests = reservationDTO.specialRequests,
            )
        return reservationsRepository.save(reservation)
    }

    fun findMyReservations(guestUsername: String): List<ReservationEntity> {
        val guest = userService.findByUsernameOrThrow(guestUsername)
        return reservationsRepository.findAllByGuestIdOrderByCreatedAtDesc(guest.id!!)
    }

    fun cancelMyReservation(
        reservationId: String,
        guestUsername: String,
    ) {
        val reservation = findByIdOrThrow(reservationId)
        val guest = userService.findByUsernameOrThrow(guestUsername)
        if (ChronoUnit.DAYS.between(LocalDate.now(), reservation.checkIn) < cancellationDaysBefore.toLong()) {
            throw IllegalArgumentException("Reservations can be cancelled minimum $cancellationDaysBefore days before check-in date")
        }
        if (reservation.guestId != guest.id) {
            throw IllegalArgumentException("You can only cancel your own reservations")
        }
        if (reservation.status !in possibleCancellationStatus) {
            throw IllegalArgumentException("Only reservations with status $possibleCancellationStatus can be cancelled")
        }
        reservation.status = ReservationStatus.CANCELED
        reservationsRepository.save(reservation)
    }

    fun rejectGuestReservation(
        reservationId: String,
        reason: String,
    ) {
        val reservation = findByIdOrThrow(reservationId)
        if (reservation.status != ReservationStatus.REQUESTED) {
            throw IllegalArgumentException("Only reservations with status REQUESTED can be rejected")
        }
        reservation.status = ReservationStatus.REJECTED
        reservation.rejectReason = reason
        reservationsRepository.save(reservation)
    }

    fun approveGuestReservation(reservationId: String) {
        val reservation = findByIdOrThrow(reservationId)
        if (reservation.status != ReservationStatus.REQUESTED) {
            throw IllegalArgumentException("Only reservations with status REQUESTED can be approved")
        }
        reservation.status = ReservationStatus.CONFIRMED
        reservationsRepository.save(reservation)
    }

    fun checkInGuestReservation(
        reservationId: String,
        paid: Boolean,
    ) {
        val reservation = findByIdOrThrow(reservationId)
        if (reservation.status != ReservationStatus.CONFIRMED) {
            throw IllegalArgumentException("Only reservations with status CONFIRMED can be checked in")
        }
        reservation.paid = paid
        reservationsRepository.save(reservation)
    }

    fun checkOutGuestReservation(reservationId: String) {
        val reservation = findByIdOrThrow(reservationId)
        if (reservation.status != ReservationStatus.CONFIRMED) {
            throw IllegalArgumentException("Only reservations with status CONFIRMED can be checked out")
        }
        reservation.status = ReservationStatus.COMPLETED
        reservationsRepository.save(reservation)
    }

    fun calculateReservationPrice(
        roomNumber: String,
        checkIn: LocalDate,
        checkOut: LocalDate,
    ): Double {
        val days = ChronoUnit.DAYS.between(checkIn, checkOut)
        val room =
            roomRepository.findByNumber(roomNumber)
                ?: throw IllegalArgumentException("Room with number $roomNumber not found")
        return room.pricePerNight * days // TODO: apply discounts, seasonal prices, etc.
    }

    fun findAllReservations(): List<ReservationEntity> = reservationsRepository.findAll()

    fun isAnyExist(): Boolean = reservationsRepository.count() > 0

    fun save(reservation: ReservationEntity): ReservationEntity = reservationsRepository.save(reservation)
}
