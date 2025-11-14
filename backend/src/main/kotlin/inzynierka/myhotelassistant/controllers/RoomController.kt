package inzynierka.myhotelassistant.controllers

import inzynierka.myhotelassistant.models.room.RoomAmenity
import inzynierka.myhotelassistant.models.room.RoomEntity
import inzynierka.myhotelassistant.models.room.RoomStandardEntity
import inzynierka.myhotelassistant.models.service.ReservationsService
import inzynierka.myhotelassistant.services.RoomService
import org.springframework.context.annotation.Lazy
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.server.ResponseStatusException
import java.time.LocalDate

@RestController
@RequestMapping("/rooms")
class RoomController(
    private val roomService: RoomService,
    @param:Lazy private val reservationsService: ReservationsService,
) {
    data class RoomWithStandardDTO(
        val number: String,
        val floor: Int,
        val capacity: Int,
        val pricePerNight: Double?,
        val standard: RoomStandardEntity,
        val description: String?,
        val amenities: Set<RoomAmenity>,
        val roomStatus: String,
    )

    @GetMapping
    fun getAllRooms(): List<RoomWithStandardDTO> = roomService.findAllRooms().map { roomService.toDTO(it) }

    @GetMapping("/{roomNumber}/price")
    fun getRoomPriceForDateRange(
        @PathVariable roomNumber: String,
        @RequestParam from: LocalDate,
        @RequestParam to: LocalDate,
    ): Double = reservationsService.calculateReservationPrice(roomNumber, from, to)

    @GetMapping("/available")
    fun getAllAvailableRoomsForDate(
        @RequestParam("from") from: LocalDate,
        @RequestParam("to") to: LocalDate,
    ): List<RoomWithStandardDTO> = roomService.findAllAvailableRoomsForDate(from, to).map { roomService.toDTO(it) }

    @PostMapping
    fun createRoom(
        @RequestBody room: RoomEntity,
    ): RoomWithStandardDTO {
        val created = roomService.createRoom(room)
        return roomService.toDTO(created)
    }

    @PutMapping
    fun updateRoom(
        @RequestBody room: RoomEntity,
    ): RoomWithStandardDTO {
        val updated = roomService.updateRoom(room)
        return roomService.toDTO(updated)
    }

    @DeleteMapping("/{number}")
    fun deleteRoom(
        @PathVariable number: String,
    ) = roomService.deleteRoom(number)

    @GetMapping("/room-standards")
    fun getAllStandards(): List<RoomStandardEntity> = roomService.findAllStandards()

    @GetMapping("/by-standard/{id}")
    fun getRoomsUsingStandard(
        @PathVariable id: String,
    ): List<RoomWithStandardDTO> = roomService.getRoomsUsingStandard(id).map { roomService.toDTO(it) }

    @PostMapping("/room-standard")
    @ResponseStatus(HttpStatus.CREATED)
    fun createRoomStandard(
        @RequestBody standard: RoomStandardEntity,
    ): RoomStandardEntity =
        try {
            roomService.createStandard(standard)
        } catch (e: IllegalArgumentException) {
            throw ResponseStatusException(HttpStatus.BAD_REQUEST, e.message)
        }

    @PutMapping("/room-standard/{id}")
    fun updateRoomStandard(
        @PathVariable id: String,
        @RequestBody standard: RoomStandardEntity,
    ): RoomStandardEntity =
        try {
            roomService.updateStandard(id, standard)
        } catch (e: IllegalArgumentException) {
            throw ResponseStatusException(HttpStatus.BAD_REQUEST, e.message)
        }

    @DeleteMapping("/room-standard/{id}")
    fun deleteRoomStandard(
        @PathVariable id: String,
    ) = try {
        roomService.deleteStandard(id)
    } catch (e: IllegalArgumentException) {
        throw ResponseStatusException(HttpStatus.BAD_REQUEST, e.message)
    }

    @GetMapping("/by/number/{id}")
    fun getRoomByNumber(
        @PathVariable("id") id: String,
    ): RoomWithStandardDTO = roomService.toDTO(roomService.findRoomByNumber(id))

    @GetMapping("/{roomNumber}/availability")
    fun checkRoomAvailability(
        @PathVariable("roomNumber") roomNumber: String,
        @RequestParam("from") from: LocalDate,
        @RequestParam("to") to: LocalDate,
    ): Map<String, Boolean> = mapOf("available" to roomService.isRoomAvailable(roomNumber, from, to))
}
