package inzynierka.myhotelassistant.controllers

import inzynierka.myhotelassistant.models.room.RoomEntity
import inzynierka.myhotelassistant.services.RoomService
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/rooms")
class RoomController(
    private val roomService: RoomService,
) {
    @GetMapping
    fun getAllRooms(): List<RoomEntity> = roomService.findAllRooms()
}
