package inzynierka.myhotelassistant.services

import inzynierka.myhotelassistant.models.room.RoomEntity
import inzynierka.myhotelassistant.repositories.RoomRepository
import org.springframework.stereotype.Service

@Service
class RoomService(private val roomRepository: RoomRepository) {

    fun findAllRooms(): List<RoomEntity> = roomRepository.findAll()
}
