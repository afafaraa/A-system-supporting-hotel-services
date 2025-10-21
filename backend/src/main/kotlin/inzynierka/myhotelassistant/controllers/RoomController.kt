package inzynierka.myhotelassistant.controllers

import inzynierka.myhotelassistant.models.room.RoomEntity
import inzynierka.myhotelassistant.models.service.ReservationsService
import inzynierka.myhotelassistant.services.RoomService
import org.springframework.context.annotation.Lazy
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import java.time.LocalDate

@RestController
@RequestMapping("/rooms")
class RoomController(
    private val roomService: RoomService,
    @param:Lazy private val reservationsService: ReservationsService,
) {
    @GetMapping
    fun getAllRooms(): List<RoomEntity> = roomService.findAllRooms()

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
    ): List<RoomEntity> = roomService.findAllAvailableRoomsForDate(from, to)

    @GetMapping("/by/number/{id}")
    fun getRoomByNumber(
        @PathVariable("id") id: String,
    ): RoomEntity = roomService.findRoomByNumber(id)

    @GetMapping("/{roomNumber}/availability")
    fun checkRoomAvailability(
        @PathVariable("roomNumber") roomNumber: String,
        @RequestParam("from") from: LocalDate,
        @RequestParam("to") to: LocalDate,
    ): Map<String, Boolean> = mapOf("available" to roomService.isRoomAvailable(roomNumber, from, to))
}
