package inzynierka.myhotelassistant.repositories

import inzynierka.myhotelassistant.models.Role
import inzynierka.myhotelassistant.models.UserEntity
import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.stereotype.Repository
import java.time.Instant

@Repository
interface UserRepository : MongoRepository<UserEntity, String> {

    fun findByUsername(username: String): UserEntity?

    fun existsByUsername(username: String): Boolean

    fun deleteByRoleAndCheckOutDateBefore(role: Role, before: Instant): Long
}
