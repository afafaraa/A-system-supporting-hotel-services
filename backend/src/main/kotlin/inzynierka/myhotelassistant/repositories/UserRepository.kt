package inzynierka.myhotelassistant.repositories

import inzynierka.myhotelassistant.models.Role
import inzynierka.myhotelassistant.models.UserEntity
import inzynierka.myhotelassistant.models.user.UserEntity
import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.stereotype.Repository

@Repository
interface UserRepository: MongoRepository<UserEntity, String> {

    fun findByUsername(username: String): UserEntity?

    fun existsByUsername(username: String): Boolean

    fun findByRolesContaining(role: Role): List<UserEntity>
}