package inzynierka.myhotelassistant.services

import inzynierka.myhotelassistant.controllers.AuthController
import inzynierka.myhotelassistant.controllers.user.AddUserController.AddUserRequest
import inzynierka.myhotelassistant.exceptions.HttpException
import inzynierka.myhotelassistant.models.RegistrationCode
import inzynierka.myhotelassistant.models.UserEntity
import inzynierka.myhotelassistant.repositories.UserRepository
import org.springframework.data.repository.findByIdOrNull
import org.springframework.security.core.userdetails.User
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import java.security.MessageDigest

@Service
class UserService(
    private val userRepository: UserRepository,
    private val codeService: RegistrationCodeService,
    private val passwordEncoder: PasswordEncoder
): UserDetailsService {

    override fun loadUserByUsername(username: String): UserDetails {
        val user = userRepository.findByUsername(username)
            ?: throw UsernameNotFoundException("User not found: \"$username\"")
        return User.builder()
            .username(user.username)
            .password(user.password)
            .roles(user.role.name)
            .build()
    }

    fun save(user: UserEntity) = userRepository.save(user)

    fun findByEmail(email: String): UserEntity? {
        return userRepository.findAll().firstOrNull { it.email == email }
    }

    fun completeRegistration(req: AuthController.CompleteRegistrationRequest) {
        val rc: RegistrationCode = codeService.validateCode(req.code)
        val user = userRepository.findByIdOrNull(rc.userId) ?: throw HttpException.UserNotFoundException("User not found")
        user.username = req.username
        user.password = passwordEncoder.encode(req.password)
        userRepository.save(user)
        codeService.markUsed(rc)
    }

    fun resetPassword(email: String, newPassword: String) {
        val user = this.findByEmail(email)
            ?: throw HttpException.UserNotFoundException("Email not found")

        user.password = passwordEncoder.encode(newPassword)
        user.let { this.save(it) }
    }

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

}