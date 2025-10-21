package inzynierka.myhotelassistant.controllers

import com.fasterxml.jackson.annotation.JsonUnwrapped
import inzynierka.myhotelassistant.models.reservation.ReservationEntity
import inzynierka.myhotelassistant.models.room.RoomEntity
import inzynierka.myhotelassistant.models.service.ReservationsService
import org.springframework.http.HttpStatus
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PatchMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController
import java.security.Principal
import java.time.LocalDate

@RestController
@RequestMapping("/reservations")
class ReservationsController(
    private val reservationsService: ReservationsService,
) {
    data class ReservationDTO(
        @field:JsonUnwrapped
        val reservation: ReservationEntity,
        val guestFullName: String?,
        val guestEmail: String?,
        val roomStandard: String,
    )

    data class ReservationGuest(
        val id: String,
        val room: RoomEntity,
        val checkIn: String,
        val checkOut: String,
        val guestCount: Int,
        val reservationPrice: Double,
        val status: String,
    )

    @GetMapping
    @PreAuthorize("hasRole(T(inzynierka.myhotelassistant.models.user.Role).EMPLOYEE.name)")
    fun getAllReservations(): List<ReservationEntity> = reservationsService.findAllReservations()

    @GetMapping("/{status}")
    @PreAuthorize("hasRole(T(inzynierka.myhotelassistant.models.user.Role).EMPLOYEE.name)")
    fun getAllReservationsWithStatus(
        @PathVariable status: String,
    ): List<ReservationDTO> = reservationsService.getAllReservationsWithStatus(status)

    @GetMapping("/mine")
    @PreAuthorize("hasRole(T(inzynierka.myhotelassistant.models.user.Role).GUEST.name)")
    fun getMyReservations(principal: Principal): List<ReservationEntity> = reservationsService.findMyReservations(principal.name)

    data class ReservationCreateDTO(
        val roomNumber: String,
        val guestUsername: String,
        val guestsCount: Int,
        val checkIn: LocalDate,
        val checkOut: LocalDate,
        val specialRequests: String?,
    )

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole(T(inzynierka.myhotelassistant.models.user.Role).GUEST.name)")
    fun createReservation(
        @RequestBody reservationDTO: ReservationCreateDTO,
    ): ReservationEntity = reservationsService.createReservation(reservationDTO)

    @PatchMapping("/{reservationId}/cancel")
    @PreAuthorize("hasRole(T(inzynierka.myhotelassistant.models.user.Role).GUEST.name)")
    fun cancelMyReservation(
        @PathVariable reservationId: String,
        principal: Principal,
    ) {
        reservationsService.cancelMyReservation(reservationId, principal.name)
    }

    data class RejectionReasonDTO(
        val reason: String,
    )

    @PatchMapping("/{reservationId}/reject")
    @PreAuthorize("hasRole(T(inzynierka.myhotelassistant.models.user.Role).EMPLOYEE.name)")
    fun rejectGuestReservation(
        @PathVariable reservationId: String,
        @RequestBody reason: RejectionReasonDTO,
    ) {
        reservationsService.rejectGuestReservation(reservationId, reason.reason)
    }

    @PatchMapping("/{reservationId}/approve")
    @PreAuthorize("hasRole(T(inzynierka.myhotelassistant.models.user.Role).EMPLOYEE.name)")
    fun approveGuestReservation(
        @PathVariable reservationId: String,
    ) {
        reservationsService.approveGuestReservation(reservationId)
    }

    @PatchMapping("/{reservationId}/check-in")
    @PreAuthorize("hasRole(T(inzynierka.myhotelassistant.models.user.Role).EMPLOYEE.name)")
    fun checkInGuestReservation(
        @PathVariable reservationId: String,
        @RequestParam paid: Boolean,
    ) {
        reservationsService.checkInGuestReservation(reservationId, paid)
    }

    @PatchMapping("/{reservationId}/check-out")
    @PreAuthorize("hasRole(T(inzynierka.myhotelassistant.models.user.Role).EMPLOYEE.name)")
    fun checkOutGuestReservation(
        @PathVariable reservationId: String,
    ) {
        reservationsService.checkOutGuestReservation(reservationId)
    }
}
