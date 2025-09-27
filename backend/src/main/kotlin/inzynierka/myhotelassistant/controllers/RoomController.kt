package inzynierka.myhotelassistant.controllers

import inzynierka.myhotelassistant.models.room.RoomEntity
import inzynierka.myhotelassistant.services.RoomService
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
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
}
