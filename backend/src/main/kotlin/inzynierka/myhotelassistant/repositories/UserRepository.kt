package inzynierka.myhotelassistant.repositories

import inzynierka.myhotelassistant.models.user.Role
import inzynierka.myhotelassistant.models.user.UserEntity
import org.bson.types.ObjectId
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.data.mongodb.repository.Query
import org.springframework.stereotype.Repository
import java.time.Instant

@Repository
interface UserRepository : MongoRepository<UserEntity, String> {
    fun findByUsername(username: String): UserEntity?

    fun findByEmail(email: String): UserEntity?

    fun existsByUsername(username: String): Boolean

    fun findByRole(role: Role): List<UserEntity>

    fun findByRoleIn(
        roles: List<Role>,
        pageable: Pageable,
    ): Page<UserEntity>

    @Query("{ 'role' : ?0, 'guestData.checkOutDate' : { \$lt: ?1 } }")
    fun deleteByRoleAndCheckOutDateBefore(
        role: Role,
        before: Instant,
    ): Long

    interface IdProjection {
        fun id(): ObjectId
    }

    @Query(value = "{ 'username' : ?0 }", fields = "{ '_id' : 1 }")
    fun findIdByUsername(username: String): IdProjection?
}
