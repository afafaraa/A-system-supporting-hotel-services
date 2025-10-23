package inzynierka.myhotelassistant.repositories

import inzynierka.myhotelassistant.models.room.RoomEntity
import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.stereotype.Repository

@Repository
interface RoomRepository : MongoRepository<RoomEntity, String> {
    fun findByNumber(number: String): RoomEntity?

    fun getRoomStandardByNumber(standardId: String): List<RoomEntity>
}
