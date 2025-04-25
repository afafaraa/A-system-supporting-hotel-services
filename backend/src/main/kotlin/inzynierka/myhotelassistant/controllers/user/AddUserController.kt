package inzynierka.myhotelassistant.controllers.user

import inzynierka.myhotelassistant.models.Role
import inzynierka.myhotelassistant.models.UserEntity
import inzynierka.myhotelassistant.models.room.RoomEntity
import inzynierka.myhotelassistant.services.RegistrationCodeService
import inzynierka.myhotelassistant.services.UserService
import jakarta.validation.Valid
import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Pattern
import org.springframework.http.HttpStatus
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController
import java.time.Instant

@RestController
class AddUserController(
    private val userService: UserService,
    private val passwordEncoder: PasswordEncoder,
    private val codeService: RegistrationCodeService
) {

    data class AddUserRequest(
        @field:Email(message = "Invalid email format") @field:NotBlank(message = "Email is required") val email: String,

        @field:NotBlank(message = "Name is required") @field:Size(
            min = 2,
            max = 50,
            message = "Name must be between 2 and 50 characters"
        ) val name: String,

        @field:NotBlank(message = "Surname is required") @field:Size(
            min = 2,
            max = 50,
            message = "Surname must be between 2 and 50 characters"
        ) val surname: String,

        @field:NotNull(message = "Room is required") val room: RoomEntity,

        @field:NotBlank(message = "Check-in date is required") @field:Pattern(
            regexp = "\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}Z",
            message = "Check-in date must be in ISO 8601 format (e.g., 2025-04-21T14:00:00Z)"
        ) val checkInDate: String,

        @field:NotBlank(message = "Check-out date is required") @field:Pattern(
            regexp = "\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}Z",
            message = "Check-out date must be in ISO 8601 format (e.g., 2025-04-22T10:00:00Z)"
        ) val checkOutDate: String
    )

    data class AddUserResponse(val username: String, val password: String)

    @PostMapping("/secured/add/guest")
    @ResponseStatus(HttpStatus.CREATED)
    fun addGuest(@RequestBody user: AddUserRequest): AddUserResponse {
        val username: String = userService.generateUsername(user)
        val password: String = userService.generatePassword(user)
        val guest = UserEntity(
            name = user.name,
            surname = user.surname,
            email = user.email,
            room = user.room,
            role = Role.GUEST,
            username = username,
            password = passwordEncoder.encode(password),
            checkInDate = Instant.parse(user.checkInDate),
            checkOutDate = Instant.parse(user.checkOutDate),
        )
        val savedGuest = userService.save(guest)
        codeService.generateAndSendForUser(
            userId = savedGuest.id!!, email = savedGuest.email, validUntil = savedGuest.checkOutDate!!
        )
        return AddUserResponse(password = password, username = username)
    }

    data class NewAdminRequest(
        @field:Email(message = "Email should be valid")
        val email: String,

        @field:NotBlank(message = "Name is required")
        @field:Size(max = 20, message = "Name cannot be longer than 20 characters")
        val name: String,

        @field:NotBlank(message = "Surname is required")
        @field:Size(max = 30, message = "Surname cannot be longer than 30 characters")
        val surname: String,

        @field:Size(min = 8, message = "Password must be at least 8 characters long")
        val password: String
    )

    @PostMapping("/secured/admin")
    @ResponseStatus(HttpStatus.CREATED)
    fun addAdmin(@RequestBody @Valid request: NewAdminRequest): AddUserResponse {
        val newAdmin = userService.createAdmin(request)
        val savedAdmin = userService.save(newAdmin)
        return AddUserResponse(password = savedAdmin.password, username = savedAdmin.username)
    }
}