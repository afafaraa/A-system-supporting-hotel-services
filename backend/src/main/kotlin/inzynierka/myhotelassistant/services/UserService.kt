package inzynierka.myhotelassistant.services

import inzynierka.myhotelassistant.controllers.AuthController
import inzynierka.myhotelassistant.controllers.user.AddUserController
import inzynierka.myhotelassistant.controllers.user.AddUserController.AddUserRequest
import inzynierka.myhotelassistant.controllers.user.AddUserController.AddUserResponse
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

    fun createAndSaveGuest(user: AddUserRequest): Pair<String, AddUserResponse> {
        val username: String = generateUsername(user)
        val password: String = generatePassword()
        val guest =
            UserEntity(
                name = user.name.lowercase().replaceFirstChar { it.uppercase() },
                surname = user.surname.lowercase().replaceFirstChar { it.uppercase() },
                email = user.email,
                role = Role.GUEST,
                username = username,
                password = passwordEncoder.encode(password),
                guestData =
                    GuestData(
                        roomNumber = user.roomNumber,
                        checkInDate =
                            user.checkInDate
                                .atTime(LocalTime.MIN)
                                .atZone(ZoneOffset.systemDefault())
                                .toInstant(),
                        checkOutDate =
                            user.checkOutDate
                                .atTime(LocalTime.MIN)
                                .atZone(ZoneOffset.systemDefault())
                                .toInstant(),
                    ),
            )
        val saved = save(guest)
        codeService.generateAndSendForUser(saved.id!!, saved.email, saved.guestData!!.checkOutDate)
        return saved.id to AddUserResponse(username = username, password = password)
    }

    fun generatePassword(): String = generateRandomString(passwordLength)

    fun generateUsername(user: AddUserRequest): String =
        "${user.name.take(4).lowercase()}-${user.surname.take(4).lowercase()}-${user.checkInDate}"

    fun generateRandomString(length: Int): String {
        val chars = ('a'..'z') + ('0'..'9')
        return (1..length)
            .map { chars.random() }
            .joinToString("")
    }

    fun completeRegistration(req: AuthController.CompleteRegistrationRequest) {
        val rc: RegistrationCode = codeService.validateCode(req.code)
        val user = userRepository.findByIdOrNull(rc.userId) ?: throw EntityNotFoundException("User not found")
        user.username = req.username
        user.password = passwordEncoder.encode(req.password)
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
