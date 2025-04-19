package inzynierka.myhotelassistant.services

import inzynierka.myhotelassistant.controllers.user.AddUserController.AddUserRequest
import inzynierka.myhotelassistant.models.user.UserEntity
import inzynierka.myhotelassistant.repositories.UserRepository
import org.springframework.security.core.userdetails.User
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.stereotype.Service
import java.security.MessageDigest

@Service
class UserService(private val userRepository: UserRepository): UserDetailsService {

    fun generatePassword(user: AddUserRequest): String {
        return encodeString(user.name + "_" + user.surname + "_" + user.room.floor.toString() + "_" + user.room.roomNumber.toString() + "_" + user.checkInDate + "_" + user.checkOutDate,12)
    }

    fun generateUsername(user: AddUserRequest): String {
        val userEncode =
            user.name.take(4) +
                    "_" + user.surname.take(4) +
                    "_" + user.room.floor.toString() +
                    "_" + user.room.roomNumber.toString()

        return userEncode + "_" + encodeString(userEncode + "_" + user.checkInDate + "_" + user.checkOutDate, 4)
    }

    fun encodeString(str: String, length: Int): String {
        val md5 = MessageDigest.getInstance("MD5")
        val hashBytes = md5.digest(str.toByteArray())
        val hexString = hashBytes.joinToString("") { "%02x".format(it) }

        return hexString.take(length)
    }

    override fun loadUserByUsername(username: String): UserDetails {
        val user = userRepository.findByUsername(username)
            ?: throw UsernameNotFoundException("User not found: \"$username\"")
        return User.builder()
            .username(user.username)
            .password(user.password)
            .roles(user.role.name)
            .build()
    }

    fun findByEmail(email: String): UserEntity? {
        return userRepository.findAll().filter{ it.email == email }.firstOrNull()
    }

    fun findByUsername(username: String): UserEntity? = userRepository.findByUsername(username)

    fun existsByUsername(username: String): Boolean = userRepository.existsByUsername(username)

    fun save(user: UserEntity) = userRepository.save(user)
}