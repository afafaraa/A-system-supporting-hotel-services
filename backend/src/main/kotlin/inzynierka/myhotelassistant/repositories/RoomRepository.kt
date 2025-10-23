package inzynierka.myhotelassistant.repositories

import inzynierka.myhotelassistant.models.room.RoomEntity
import inzynierka.myhotelassistant.models.room.RoomStandardEntity
import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.stereotype.Repository

@Repository
interface RoomRepository : MongoRepository<RoomEntity, String> {
    fun findByNumber(number: String): RoomEntity?

    fun findRoomStandardByNumber(number: String): RoomStandardEntity? {
        val room = findByNumber(number)
        return room?.standard
    }

    fun findAllByStandard(standard: RoomStandardEntity): List<RoomEntity>
}
