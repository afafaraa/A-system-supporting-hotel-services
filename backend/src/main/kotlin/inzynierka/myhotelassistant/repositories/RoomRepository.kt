package inzynierka.myhotelassistant.repositories

import inzynierka.myhotelassistant.models.room.RoomEntity
import inzynierka.myhotelassistant.models.room.RoomStandard
import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.stereotype.Repository

@Repository
interface RoomRepository : MongoRepository<RoomEntity, String> {
    fun findByNumber(number: String): RoomEntity?

    data class RoomStandardClass(
        val standard: RoomStandard,
    )

    fun getRoomStandardByNumber(id: String): RoomStandardClass?
}
