package inzynierka.myhotelassistant.models.service

import inzynierka.myhotelassistant.controllers.ReservationsController
import inzynierka.myhotelassistant.controllers.user.AddUserController
import inzynierka.myhotelassistant.models.reservation.ReservationEntity
import inzynierka.myhotelassistant.models.reservation.ReservationStatus
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
            .map { transformToDTO(it) }
    }

    private fun transformToDTO(reservation: ReservationEntity): ReservationsController.ReservationDTO {
        val guest = userService.getUserNameAndEmailById(reservation.guestId)
        val room =
            roomRepository.getRoomStandardByNumber(reservation.roomNumber)
                ?: throw IllegalArgumentException("Room with number ${reservation.roomNumber} not found")
        return ReservationsController.ReservationDTO(
            reservation,
            "${guest?.name} ${guest?.surname}",
            guest?.email,
            room.standard.displayName,
        )
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
    ): ReservationsController.ReservationDTO {
        val reservation = findByIdOrThrow(reservationId)
        if (reservation.status != ReservationStatus.CONFIRMED) {
            throw IllegalArgumentException("Only reservations with status CONFIRMED can be checked in")
        }
        reservation.status = ReservationStatus.CHECKED_IN
        reservation.paid = paid
        return transformToDTO(reservationsRepository.save(reservation))
    }

    fun checkOutGuestReservation(reservationId: String): ReservationsController.ReservationDTO {
        val reservation = findByIdOrThrow(reservationId)
        if (reservation.status != ReservationStatus.CHECKED_IN) {
            throw IllegalArgumentException("Only reservations with status CHECKED_IN can be checked out")
        }
        reservation.status = ReservationStatus.COMPLETED
        return transformToDTO(reservationsRepository.save(reservation))
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

    fun getCheckInsFromDay(date: LocalDate?): List<ReservationsController.ReservationDTO> {
        val reservations = reservationsRepository.findAllByCheckInIsAndStatusIs(date ?: LocalDate.now(), ReservationStatus.CONFIRMED)
        return reservations.map { transformToDTO(it) }
    }

    fun getCheckOutsFromDay(date: LocalDate?): List<ReservationsController.ReservationDTO> {
        val reservations = reservationsRepository.findAllByCheckOutIsAndStatusIs(date ?: LocalDate.now(), ReservationStatus.CHECKED_IN)
        return reservations.map { transformToDTO(it) }
    }

    fun getUpcomingCheckIns(): List<ReservationsController.ReservationDTO> {
        val today = LocalDate.now()
        val reservations =
            reservationsRepository.findAllByCheckInIsBetweenAndStatusInOrderByCheckIn(
                checkInAfter = today,
                checkInBefore = today.plusDays(30),
                statuses = listOf(ReservationStatus.CONFIRMED, ReservationStatus.REQUESTED),
            )
        return reservations.map { transformToDTO(it) }
    }

    fun getUpcomingCheckOuts(): List<ReservationsController.ReservationDTO> {
        val today = LocalDate.now()
        val reservations =
            reservationsRepository.findAllByCheckOutIsBetweenAndStatusIsOrderByCheckOut(
                checkOutAfter = today,
                checkOutBefore = today.plusDays(30),
                status = ReservationStatus.CHECKED_IN,
            )
        return reservations.map { transformToDTO(it) }
    }

    fun getOverdueCheckIns(): List<ReservationsController.ReservationDTO> {
        val today = LocalDate.now()
        val reservations =
            reservationsRepository.findAllByCheckInIsBeforeAndStatusIsIn(
                checkInDate = today,
                statuses = listOf(ReservationStatus.CONFIRMED, ReservationStatus.REQUESTED),
            )
        return reservations.map { transformToDTO(it) }
    }

    fun getOverdueCheckOuts(): List<ReservationsController.ReservationDTO> {
        val today = LocalDate.now()
        val reservations =
            reservationsRepository.findAllByCheckOutIsBeforeAndStatusIsIn(
                checkOutDate = today,
                statuses = listOf(ReservationStatus.CHECKED_IN),
            )
        return reservations.map { transformToDTO(it) }
    }

    fun countOverdueCheckIns(): Long {
        val today = LocalDate.now()
        return reservationsRepository.countAllByCheckInIsBeforeAndStatusIsIn(
            checkInDate = today,
            statuses = listOf(ReservationStatus.CONFIRMED, ReservationStatus.REQUESTED),
        )
    }

    fun countOverdueCheckOuts(): Long {
        val today = LocalDate.now()
        return reservationsRepository.countAllByCheckOutIsBeforeAndStatusIsIn(
            checkOutDate = today,
            statuses = listOf(ReservationStatus.CHECKED_IN),
        )
    }

    fun createReservationWithNewGuest(
        dto: ReservationsController.ReservationCreateWithNewGuestDTO,
    ): ReservationsController.ReservationCreateWithNewGuestResponseDTO {
        val (guestId, addUserResponse) =
            userService.createAndSaveGuest(
                AddUserController.AddUserRequest(
                    email = dto.email,
                    name = dto.name,
                    surname = dto.surname,
                    roomNumber = dto.roomNumber,
                    checkInDate = dto.checkInDate,
                    checkOutDate = dto.checkOutDate,
                ),
            )
        val reservation =
            ReservationEntity(
                roomNumber = dto.roomNumber,
                guestId = guestId,
                guestsCount = dto.guestCount,
                checkIn = dto.checkInDate,
                checkOut = dto.checkOutDate,
                reservationPrice = calculateReservationPrice(dto.roomNumber, dto.checkInDate, dto.checkOutDate),
                specialRequests = dto.specialRequests,
            )
        reservation.status = if (dto.withCheckIn) ReservationStatus.CHECKED_IN else ReservationStatus.CONFIRMED
        val savedReservation = reservationsRepository.save(reservation)
        val refreshedReservation = findByIdOrThrow(savedReservation.id!!)

        return ReservationsController.ReservationCreateWithNewGuestResponseDTO(
            reservation = transformToDTO(refreshedReservation),
            userAccount = addUserResponse,
        )
    }
}
