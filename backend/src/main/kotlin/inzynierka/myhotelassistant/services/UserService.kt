package inzynierka.myhotelassistant.services

import inzynierka.myhotelassistant.controllers.AuthController
import inzynierka.myhotelassistant.controllers.user.AddUserController
import inzynierka.myhotelassistant.controllers.user.AddUserController.AddUserRequest
import inzynierka.myhotelassistant.controllers.user.AddUserController.AddUserResponse
import inzynierka.myhotelassistant.exceptions.HttpException.EntityNotFoundException
import inzynierka.myhotelassistant.exceptions.HttpException.InvalidArgumentException
import inzynierka.myhotelassistant.models.RegistrationCode
import inzynierka.myhotelassistant.models.user.GuestData
import inzynierka.myhotelassistant.models.user.Role
import inzynierka.myhotelassistant.models.user.UserEntity
import inzynierka.myhotelassistant.repositories.UserRepository
import org.springframework.data.domain.Pageable
import org.springframework.data.repository.findByIdOrNull
import org.springframework.security.core.userdetails.User
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import java.security.MessageDigest
import java.time.Instant
import java.time.format.DateTimeParseException
import kotlin.jvm.optionals.getOrNull

@Service
class UserService(
    private val userRepository: UserRepository,
    private val codeService: RegistrationCodeService,
    private val passwordEncoder: PasswordEncoder,
) : UserDetailsService {
    fun findByRole(role: Role): List<UserEntity> = userRepository.findByRole(role)

    fun findById(id: String): UserEntity? = userRepository.findById(id).getOrNull()

    override fun loadUserByUsername(username: String): UserDetails {
        val user =
            userRepository.findByUsername(username)
                ?: throw UsernameNotFoundException("User with username $username not found")
        return User
            .builder()
            .username(user.username)
            .password(user.password)
            .roles(user.role.name)
            .build()
    }

    fun getUserNameAndEmailById(id: String): UserRepository.UserNameAndEmail? = userRepository.getUserNameAndEmailById(id)

    fun save(user: UserEntity): UserEntity = userRepository.save(user)

    fun findByEmail(email: String): UserEntity? = userRepository.findByEmail(email)

    fun findByEmailOrThrow(email: String): UserEntity =
        userRepository.findByEmail(email)
            ?: throw EntityNotFoundException("User with given email was not found")

    fun findByUsernameOrThrow(username: String): UserEntity =
        userRepository.findByUsername(username)
            ?: throw EntityNotFoundException("User with given username was not found")

    fun changePassword(
        email: String,
        newPassword: String,
    ) {
        val user = findByEmailOrThrow(email)
        user.password = passwordEncoder.encode(newPassword)
        userRepository.save(user)
    }

    fun createAndSaveGuest(user: AddUserRequest): AddUserResponse {
        val username: String = generateUsername(user)
        val password: String = generatePassword(user)
        try {
            val guest =
                UserEntity(
                    name = user.name,
                    surname = user.surname,
                    email = user.email,
                    role = Role.GUEST,
                    username = username,
                    password = passwordEncoder.encode(password),
                    guestData =
                        GuestData(
                            roomNumber = user.roomNumber,
                            checkInDate = Instant.parse(user.checkInDate),
                            checkOutDate = Instant.parse(user.checkOutDate),
                        ),
                )
            val saved = save(guest)
            codeService.generateAndSendForUser(saved.id!!, saved.email, saved.guestData!!.checkOutDate)
        } catch (e: DateTimeParseException) {
            throw InvalidArgumentException(e.message ?: "Invalid date format")
        }
        return AddUserResponse(username = username, password = password)
    }

    fun generatePassword(user: AddUserRequest): String =
        encodeString(
            user.name + "_" + user.surname + "_" + user.roomNumber + "_" + user.checkInDate + "_" + user.checkOutDate,
            12,
        )

    fun generateUsername(user: AddUserRequest): String {
        val userEncode =
            user.name.take(4) +
                "_" + user.surname.take(4) +
                "_" + user.roomNumber

        return userEncode + "_" + encodeString(userEncode + "_" + user.checkInDate + "_" + user.checkOutDate, 4)
    }

    fun encodeString(
        str: String,
        length: Int,
    ): String {
        val md5 = MessageDigest.getInstance("MD5")
        val hashBytes = md5.digest(str.toByteArray())
        val hexString = hashBytes.joinToString("") { "%02x".format(it) }

        return hexString.take(length)
    }

    fun completeRegistration(req: AuthController.CompleteRegistrationRequest) {
        val rc: RegistrationCode = codeService.validateCode(req.code)
        val user = userRepository.findByIdOrNull(rc.userId) ?: throw EntityNotFoundException("User not found")
        user.username = req.username
        user.password = passwordEncoder.encode(req.password)
        userRepository.save(user)
        codeService.markUsed(rc)
    }

    fun completeRegistrationNoCode(req: AuthController.CompleteRegistrationRequestNoCode): UserEntity {
        if (userRepository.findByUsername(req.username) != null) {
            throw EntityNotFoundException("Username is already taken")
        }
        if (userRepository.findByEmail(req.email) != null) {
            throw EntityNotFoundException("User with that email already exists")
        }
        val user =
            UserEntity(
                username = req.username,
                password = passwordEncoder.encode(req.password),
                name = req.name,
                surname = req.surname,
                email = req.email,
                role = Role.GUEST,
            )
        println("Creating user: $user")
        return userRepository.save(user)
    }

    fun activateWithCode(code: String) {
        val rc: RegistrationCode = codeService.validateCode(code)
        val user = userRepository.findByIdOrNull(rc.userId) ?: throw EntityNotFoundException("User not found")
        user.active = true
        userRepository.save(user)
        codeService.markUsed(rc)
    }

    fun createAdmin(request: AddUserController.NewAdminRequest): UserEntity =
        UserEntity(
            username = "admin_${request.name}",
            password = passwordEncoder.encode(request.password),
            email = request.email,
            name = request.name.lowercase().replaceFirstChar { it.uppercase() },
            surname = request.surname.lowercase().replaceFirstChar { it.uppercase() },
            role = Role.ADMIN,
        )

    fun getCurrentUser(username: String) = findByUsernameOrThrow(username)

    fun getAllGuests(pageable: Pageable): List<UserEntity> = userRepository.findByRoleIn(listOf(Role.GUEST), pageable).content
}
