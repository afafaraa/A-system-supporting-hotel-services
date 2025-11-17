package inzynierka.myhotelassistant.services

import inzynierka.myhotelassistant.controllers.AuthController
import inzynierka.myhotelassistant.controllers.user.AddUserController
import inzynierka.myhotelassistant.exceptions.HttpException
import inzynierka.myhotelassistant.exceptions.HttpException.EntityNotFoundException
import inzynierka.myhotelassistant.models.RegistrationCode
import inzynierka.myhotelassistant.models.user.GuestData
import inzynierka.myhotelassistant.models.user.Role
import inzynierka.myhotelassistant.models.user.UserEntity
import inzynierka.myhotelassistant.repositories.UserRepository
import org.springframework.beans.factory.annotation.Value
import org.springframework.data.domain.Pageable
import org.springframework.data.repository.findByIdOrNull
import org.springframework.security.core.userdetails.User
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import java.time.LocalDate
import java.time.LocalTime
import java.time.ZoneOffset
import kotlin.jvm.optionals.getOrNull

@Service
class UserService(
    private val userRepository: UserRepository,
    private val codeService: RegistrationCodeService,
    private val passwordEncoder: PasswordEncoder,
) : UserDetailsService {
    @field:Value("\${app.security.password-length}")
    private var passwordLength: Int = 10

    fun findByIdOrThrow(id: String): UserEntity =
        userRepository.findById(id).getOrNull()
            ?: throw EntityNotFoundException("User with given id was not found")

    override fun loadUserByUsername(username: String): UserDetails {
        val user =
            userRepository.findByUsername(username)
                ?: throw UsernameNotFoundException("User with username $username not found")
        if (!user.emailAuthorized) {
            throw HttpException.NoPermissionException("This users email is not verified")
        }
        return User
            .builder()
            .username(user.username)
            .password(user.password)
            .roles(user.role.name)
            .build()
    }

    fun getUserGuestDataById(id: String): GuestData =
        userRepository.getUserGuestDataById(id)?.guestData
            ?: throw EntityNotFoundException("Guest data for user with given id was not found")

    fun findUserNameById(id: String): String? = userRepository.findUserNameById(id)?.let { it.name + " " + it.surname }

    fun getUserEmailById(id: String): String? = userRepository.findUserEmailById(id)?.email

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

    data class NewUserDetails(
        val name: String,
        val surname: String,
        val email: String,
        val checkIn: LocalDate,
        val active: Boolean = false,
    )

    fun createAndSaveGuest(user: NewUserDetails): UserEntity {
        val username: String = generateUsername(user.name, user.surname, user.checkIn)
        val password: String = generatePassword()
        val guest =
            UserEntity(
                name = user.name.lowercase().replaceFirstChar { it.uppercase() },
                surname = user.surname.lowercase().replaceFirstChar { it.uppercase() },
                email = user.email,
                role = Role.GUEST,
                username = username,
                password = passwordEncoder.encode(password),
                active = user.active,
            )
        val savedGuest = save(guest)
        return savedGuest
    }

    fun sendCodeForGuest(
        guestId: String,
        guestEmail: String,
        guestCheckOut: LocalDate,
    ): String = codeService.generateAndSendForUser(guestId, guestEmail, guestCheckOut.atTime(LocalTime.MAX).toInstant(ZoneOffset.UTC))

    fun generatePassword(): String = generateRandomString(passwordLength)

    fun generateUsername(
        name: String,
        surname: String,
        checkIn: LocalDate,
    ): String = "${name.take(4).lowercase()}-${surname.take(4).lowercase()}-$checkIn"

    fun generateRandomString(length: Int): String {
        val chars = ('a'..'z') + ('0'..'9')
        return (1..length)
            .map { chars.random() }
            .joinToString("")
    }

    fun completeRegistration(req: AuthController.CompleteRegistrationRequest): UserEntity {
        val rc: RegistrationCode = codeService.validateCode(req.code)
        val user = userRepository.findByIdOrNull(rc.userId) ?: throw EntityNotFoundException("User not found")
        user.username = req.username
        user.password = passwordEncoder.encode(req.password)
        val savedUser = userRepository.save(user)
        codeService.markUsed(rc)
        return savedUser
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
