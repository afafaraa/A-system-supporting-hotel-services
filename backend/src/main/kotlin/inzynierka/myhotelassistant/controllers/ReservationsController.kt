package inzynierka.myhotelassistant.controllers

import com.fasterxml.jackson.annotation.JsonUnwrapped
import inzynierka.myhotelassistant.models.reservation.ReservationEntity
import inzynierka.myhotelassistant.models.room.RoomAmenity
import inzynierka.myhotelassistant.models.service.ReservationsService
import jakarta.validation.Valid
import jakarta.validation.constraints.Email
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
    data class RoomStandardDTO(
        val id: String?,
        val name: String,
        val capacity: Int,
        val basePrice: Double,
        val description: String?,
    )

    data class RoomDTO(
        val number: String,
        val floor: Int?,
        val capacity: Int,
        val pricePerNight: Double,
        val description: String?,
        val amenities: Set<RoomAmenity>,
        val roomStatus: String,
        val standard: RoomStandardDTO,
    )

    data class ReservationDTO(
        @field:JsonUnwrapped
        val reservation: ReservationEntity,
        val guestFullName: String?,
        val guestEmail: String?,
        val roomStandard: String,
    )

    data class ReservationWithRoomStandardDTO(
        @field:JsonUnwrapped
        val reservation: ReservationEntity,
        val roomStandard: String,
    )

    data class ReservationGuestDTO(
        val id: String,
        val room: RoomDTO,
        val checkIn: String,
        val checkOut: String,
        val guestCount: Int,
        val reservationPrice: Double,
        val status: String,
        val specialRequests: String? = null,
    )

    @GetMapping
    @PreAuthorize("hasRole(T(inzynierka.myhotelassistant.models.user.Role).EMPLOYEE.name)")
    fun getAllReservations(): List<ReservationEntity> = reservationsService.findAllReservations()

    @GetMapping("/by-ids")
    @PreAuthorize(
        "hasAnyRole(T(inzynierka.myhotelassistant.models.user.Role).GUEST.name," +
            "T(inzynierka.myhotelassistant.models.user.Role).RECEPTIONIST.name)",
    )
    fun getAllReservationsForByIds(
        @RequestParam(name = "ids") reservationIds: List<String>,
    ): List<ReservationWithRoomStandardDTO> = reservationsService.getAllReservationsByIds(reservationIds)

    @GetMapping("/{status}")
    @PreAuthorize("hasRole(T(inzynierka.myhotelassistant.models.user.Role).EMPLOYEE.name)")
    fun getAllReservationsWithStatus(
        @PathVariable status: String,
    ): List<ReservationDTO> = reservationsService.getAllReservationsWithStatus(status)

    @GetMapping("/mine")
    @PreAuthorize("hasRole(T(inzynierka.myhotelassistant.models.user.Role).GUEST.name)")
    fun getMyReservations(principal: Principal): List<ReservationGuestDTO> =
        reservationsService.findMyReservationsAsGuestDTO(principal.name)

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
    ): ReservationDTO = reservationsService.checkInGuestReservation(reservationId, paid)

    @PatchMapping("/{reservationId}/check-out")
    @PreAuthorize("hasRole(T(inzynierka.myhotelassistant.models.user.Role).EMPLOYEE.name)")
    fun checkOutGuestReservation(
        @PathVariable reservationId: String,
    ): ReservationDTO = reservationsService.checkOutGuestReservation(reservationId)

    @GetMapping("/today-check-ins")
    @PreAuthorize("hasRole(T(inzynierka.myhotelassistant.models.user.Role).RECEPTIONIST.name)")
    fun getTodayCheckIns(
        @RequestParam(required = false) date: LocalDate = LocalDate.now(),
    ): List<ReservationDTO> = reservationsService.getCheckInsFromDay(date)

    @GetMapping("/today-check-outs")
    @PreAuthorize("hasRole(T(inzynierka.myhotelassistant.models.user.Role).RECEPTIONIST.name)")
    fun getTodayCheckOuts(
        @RequestParam(required = false) date: LocalDate = LocalDate.now(),
    ): List<ReservationDTO> = reservationsService.getCheckOutsFromDay(date)

    @GetMapping("/upcoming-check-ins")
    @PreAuthorize("hasRole(T(inzynierka.myhotelassistant.models.user.Role).RECEPTIONIST.name)")
    fun getUpcomingCheckIns(): List<ReservationDTO> = reservationsService.getUpcomingCheckIns()

    @GetMapping("/upcoming-check-outs")
    @PreAuthorize("hasRole(T(inzynierka.myhotelassistant.models.user.Role).RECEPTIONIST.name)")
    fun getUpcomingCheckOuts(): List<ReservationDTO> = reservationsService.getUpcomingCheckOuts()

    data class CountDTO(
        val count: Long,
    )

    @GetMapping("/overdue-check-ins")
    @PreAuthorize("hasRole(T(inzynierka.myhotelassistant.models.user.Role).RECEPTIONIST.name)")
    fun getOverdueCheckIns(): List<ReservationDTO> = reservationsService.getOverdueCheckIns()

    @GetMapping("/overdue-check-ins/count")
    @PreAuthorize("hasRole(T(inzynierka.myhotelassistant.models.user.Role).RECEPTIONIST.name)")
    fun countOverdueCheckIns() = CountDTO(reservationsService.countOverdueCheckIns())

    @GetMapping("/overdue-check-outs")
    @PreAuthorize("hasRole(T(inzynierka.myhotelassistant.models.user.Role).RECEPTIONIST.name)")
    fun getOverdueCheckOuts(): List<ReservationDTO> = reservationsService.getOverdueCheckOuts()

    @GetMapping("/overdue-check-outs/count")
    @PreAuthorize("hasRole(T(inzynierka.myhotelassistant.models.user.Role).RECEPTIONIST.name)")
    fun countOverdueCheckOuts() = CountDTO(reservationsService.countOverdueCheckOuts())

    data class ReservationCreateWithNewGuestDTO(
        @field:Email(message = "Email should be valid")
        val email: String,
        val name: String,
        val surname: String,
        val roomNumber: String,
        val checkInDate: LocalDate,
        val checkOutDate: LocalDate,
        val guestCount: Int,
        val specialRequests: String?,
        val withCheckIn: Boolean,
    )

    data class ReservationWithGuestCode(
        val reservation: ReservationDTO,
        val code: String,
    )

    @PostMapping("/with-new-guest")
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole(T(inzynierka.myhotelassistant.models.user.Role).RECEPTIONIST.name)")
    fun createReservationWithNewGuest(
        @RequestBody @Valid reservationWithGuestDTO: ReservationCreateWithNewGuestDTO,
    ): ReservationWithGuestCode = reservationsService.createReservationWithNewGuest(reservationWithGuestDTO)

    @GetMapping("/ongoing")
    @PreAuthorize("hasRole(T(inzynierka.myhotelassistant.models.user.Role).EMPLOYEE.name)")
    fun getAllOngoingReservations() = reservationsService.getAllOngoingReservations()
}
