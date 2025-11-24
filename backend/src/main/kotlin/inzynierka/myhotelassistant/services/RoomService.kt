package inzynierka.myhotelassistant.services

import inzynierka.myhotelassistant.controllers.RoomController
import inzynierka.myhotelassistant.models.room.RoomEntity
import inzynierka.myhotelassistant.models.room.RoomStandardEntity
import inzynierka.myhotelassistant.models.service.ReservationsService
import inzynierka.myhotelassistant.repositories.RoomRepository
import inzynierka.myhotelassistant.repositories.RoomStandardRepository
import org.springframework.stereotype.Service
import java.time.LocalDate
import kotlin.jvm.optionals.getOrNull

@Service
class RoomService(
    private val roomRepository: RoomRepository,
    private val reservationsService: ReservationsService,
    private val roomStandardRepository: RoomStandardRepository,
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

    fun createRoom(room: RoomEntity): RoomEntity {
        require(!(roomRepository.existsById(room.number))) {
            "room with id ${room.number} already exists"
        }
        return roomRepository.save(room)
    }

    fun updateRoom(room: RoomEntity): RoomEntity {
        require((roomRepository.existsById(room.number))) {
            "room with id ${room.number} not found"
        }
        val roomToUpdate = room.copy(number = room.number)
        return roomRepository.save(roomToUpdate)
    }

    fun deleteRoom(number: String) {
        require((roomRepository.existsById(number))) {
            "room with id $number not found"
        }
        return roomRepository.deleteById(number)
    }

    fun findAllStandards(): List<RoomStandardEntity> = roomStandardRepository.findAll()

    fun findStandardById(id: String): RoomStandardEntity =
        roomStandardRepository
            .findById(id)
            .orElseThrow { IllegalArgumentException("Room standard with id $id was not found") }

    fun findStandardByRoomNumber(roomNumber: String): RoomStandardEntity =
        roomRepository.findRoomStandardIdByNumber(roomNumber)?.let {
            roomStandardRepository.findById(it.standardId).getOrNull()
        } ?: throw IllegalArgumentException("Room standard with room number $roomNumber was not found")

    fun createStandard(standard: RoomStandardEntity): RoomStandardEntity {
        require(!roomStandardRepository.existsByName(standard.name)) {
            "Room standard with name ${standard.name} already exists"
        }
        return roomStandardRepository.save(standard)
    }

    fun updateStandard(
        id: String,
        standard: RoomStandardEntity,
    ): RoomStandardEntity {
        val existingStandard = findStandardById(id)
        require((existingStandard.name != standard.name && roomStandardRepository.existsByName(standard.name))) {
            "Room standard with name '${standard.name}' already exists"
        }
        val standardToUpdate = standard.copy(id = id)
        return roomStandardRepository.save(standardToUpdate)
    }

    fun deleteStandard(id: String) {
        require(roomStandardRepository.existsById(id)) {
            "Room standard with id $id not found"
        }

        val roomsUsingStandard = roomRepository.findAllByStandardId(id)

        require(roomsUsingStandard.isEmpty()) {
            "Cannot delete room standard: ${roomsUsingStandard.size} room(s) are using this standard"
        }

        roomStandardRepository.deleteById(id)
    }

    fun getRoomsUsingStandard(id: String): List<RoomEntity> {
        require(roomStandardRepository.existsById(id)) {
            "Room standard with id $id not found"
        }

        return roomRepository.findAllByStandardId(id)
    }

    fun findRoomByNumber(number: String): RoomEntity =
        roomRepository.findByNumber(number)
            ?: throw NoSuchElementException("Room with number $number not found")

    fun isRoomAvailable(
        roomNumber: String,
        from: LocalDate,
        to: LocalDate,
    ): Boolean {
        if (!from.isBefore(to)) {
            throw IllegalArgumentException("'from' must be before 'to' date")
        }
        return reservationsService.isRoomAvailable(roomNumber, from, to)
    }

    fun toDTO(room: RoomEntity): RoomController.RoomWithStandardDTO {
        val standard = findStandardById(room.standardId)

        return RoomController.RoomWithStandardDTO(
            number = room.number,
            floor = room.floor,
            capacity = room.capacity,
            pricePerNight = room.pricePerNight ?: standard.basePrice,
            standard = standard,
            description = room.description,
            amenities = room.amenities,
            roomStatus = room.roomStatus.name,
        )
    }
}
