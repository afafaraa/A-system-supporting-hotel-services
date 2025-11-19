package inzynierka.myhotelassistant.repositories

import inzynierka.myhotelassistant.models.user.GuestData
import inzynierka.myhotelassistant.models.user.Role
import inzynierka.myhotelassistant.models.user.UserEntity
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.stereotype.Repository

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

    data class UserName(
        val name: String,
        val surname: String,
    )

    fun findUserNameById(id: String): UserName?

    data class UserNameAndEmail(
        val name: String,
        val surname: String,
        val email: String,
    )

    fun getUserNameAndEmailById(id: String): UserNameAndEmail?

    data class UserEmail(
        val email: String,
    )

    fun findUserEmailById(id: String): UserEmail?

    data class UserGuestData(
        val guestData: GuestData?,
    )

    fun getUserGuestDataById(id: String): UserGuestData?
}
