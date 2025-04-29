package inzynierka.myhotelassistant.services

import inzynierka.myhotelassistant.controllers.AuthController
import inzynierka.myhotelassistant.controllers.user.AddUserController.AddUserRequest
import inzynierka.myhotelassistant.exceptions.HttpException
import inzynierka.myhotelassistant.models.RegistrationCode
import inzynierka.myhotelassistant.controllers.user.AddUserController
import inzynierka.myhotelassistant.controllers.user.AddUserController.AddUserResponse
import inzynierka.myhotelassistant.exceptions.HttpException.InvalidArgumentException
import inzynierka.myhotelassistant.models.Role
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
import java.time.Instant
import inzynierka.myhotelassistant.exceptions.HttpException.UserNotFoundException
import java.time.format.DateTimeParseException

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

    fun save(user: UserEntity): UserEntity {
        if (userRepository.existsByUsername(user.username))
            throw HttpException.UserAlreadyExistsException("User already exists: \"${user.username}\"")
        return userRepository.save(user)
    }

    fun findByEmailOrThrow(email: String): UserEntity {
        return userRepository.findByEmail(email)
            ?: throw UserNotFoundException("User with given email was not found")
    }

    fun resetPassword(email: String, newPassword: String) {
        val user = this.findByEmailOrThrow(email)
        user.password = passwordEncoder.encode(newPassword)
        userRepository.save(user)
    }

    fun createAndSaveGuest(user: AddUserRequest): AddUserResponse {
        val username: String = generateUsername(user)
        val password: String = generatePassword(user)
        try {
            val guest = UserEntity(
                name=user.name,
                surname=user.surname,
                email=user.email,
                room=user.room,
                role=Role.GUEST,
                username=username,
                password=passwordEncoder.encode(password),
                checkInDate=Instant.parse(user.checkInDate),
                checkOutDate=Instant.parse(user.checkOutDate),
            )
            val saved = save(guest)
            codeService.generateAndSendForUser(saved.id!!, saved.email, saved.checkOutDate!!)
        } catch (e: DateTimeParseException) {
            throw InvalidArgumentException(e.message ?: "Invalid date format")
        }
        return AddUserResponse(username = username, password = password,)
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

    fun completeRegistration(req: AuthController.CompleteRegistrationRequest) {
        val rc: RegistrationCode = codeService.validateCode(req.code)
        val user = userRepository.findByIdOrNull(rc.userId) ?: throw UserNotFoundException("User not found")
        user.username = req.username
        user.password = passwordEncoder.encode(req.password)
        userRepository.save(user)
        codeService.markUsed(rc)
    }

    fun createAdmin(request: AddUserController.NewAdminRequest): UserEntity {
        return UserEntity(
            username = "admin_${request.name}",
            password = passwordEncoder.encode(request.password),
            email = request.email,
            name = request.name.lowercase().replaceFirstChar { it.uppercase() },
            surname = request.surname.lowercase().replaceFirstChar { it.uppercase() },
            role = Role.ADMIN,
            checkInDate = Instant.now(),
        )
    }
}