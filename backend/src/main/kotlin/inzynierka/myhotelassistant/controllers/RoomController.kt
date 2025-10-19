package inzynierka.myhotelassistant.controllers

import inzynierka.myhotelassistant.models.room.RoomEntity
import inzynierka.myhotelassistant.models.room.RoomStandardEntity
import inzynierka.myhotelassistant.services.RoomService
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
) {
    @GetMapping
    fun getAllRooms(): List<RoomEntity> = roomService.findAllRooms()

    @GetMapping("/available")
    fun getAllAvailableRoomsForDate(
        @RequestParam("from") from: LocalDate,
        @RequestParam("to") to: LocalDate,
    ): List<RoomEntity> = roomService.findAllAvailableRoomsForDate(from, to)

    @GetMapping("/{number}")
    fun getRoomByNumber(
        @PathVariable number: String,
    ): RoomEntity? = roomService.findRoomByNumber(number)

    @PostMapping
    fun createRoom(
        @RequestBody room: RoomEntity,
    ): RoomEntity = roomService.createRoom(room)

    @PutMapping("/{number}")
    fun updateRoom(
        @PathVariable number: String,
        @RequestBody room: RoomEntity,
    ): RoomEntity = roomService.updateRoom(number, room)

    @DeleteMapping("/{number}")
    fun deleteRoom(
        @PathVariable number: String,
    ) = roomService.deleteRoom(number)

    @GetMapping("/room-standards")
    fun getAllStandards(): List<RoomStandardEntity> = roomService.findAllStandards()

    @GetMapping("/by-standard/{id}")
    fun getRoomsUsingStandard(
        @PathVariable id: String,
    ): List<RoomEntity> = roomService.getRoomsUsingStandard(id)

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

    @PutMapping("room-standard/{id}")
    fun updateRoomStandard(
        @PathVariable id: String,
        @RequestBody standard: RoomStandardEntity,
    ): RoomStandardEntity =
        try {
            roomService.updateStandard(id, standard)
        } catch (e: IllegalArgumentException) {
            throw ResponseStatusException(HttpStatus.BAD_REQUEST, e.message)
        }

    @DeleteMapping("room-standard/{id}")
    fun deleteRoomStandard(
        @PathVariable id: String,
    ) = try {
        roomService.deleteStandard(id)
    } catch (e: IllegalArgumentException) {
        throw ResponseStatusException(HttpStatus.BAD_REQUEST, e.message)
    }
}
