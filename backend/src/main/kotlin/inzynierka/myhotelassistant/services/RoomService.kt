package inzynierka.myhotelassistant.services

import inzynierka.myhotelassistant.models.room.RoomEntity
import inzynierka.myhotelassistant.models.service.ReservationsService
import inzynierka.myhotelassistant.repositories.RoomRepository
import org.springframework.stereotype.Service
import java.time.LocalDate

@Service
class RoomService(
    private val roomRepository: RoomRepository,
    private val reservationsService: ReservationsService,
) {
    fun findAllRooms(): List<RoomEntity> = roomRepository.findAll()

    fun findAllAvailableRoomsForDate(
        from: LocalDate,
        to: LocalDate,
    ): List<RoomEntity> {
        if (!from.isBefore(to)) {
            throw IllegalArgumentException("'from' must be before 'to' date")
        }
        return roomRepository
            .findAll()
            .filter { room -> reservationsService.isRoomAvailable(room.number, from, to) }
    }
}
