package inzynierka.myhotelassistant.repositories

import inzynierka.myhotelassistant.models.room.RoomStandardEntity
import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.stereotype.Repository

@Repository
interface RoomStandardRepository : MongoRepository<RoomStandardEntity, String> {
    fun findByName(name: String): RoomStandardEntity?

    fun existsByName(name: String): Boolean
}
