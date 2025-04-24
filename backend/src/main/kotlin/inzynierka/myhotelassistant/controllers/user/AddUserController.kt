package inzynierka.myhotelassistant.controllers.user

import inzynierka.myhotelassistant.models.Role
import inzynierka.myhotelassistant.models.UserEntity
import inzynierka.myhotelassistant.models.room.RoomEntity
import inzynierka.myhotelassistant.services.UserService
import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank
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
class AddUserController(private val userService: UserService, private val passwordEncoder: PasswordEncoder) {


    data class AddUserRequest(
        @field:Email(message = "Email should be valid")
        val email: String,

        @field:Pattern(regexp = "^[A-Z][a-z-]{1,19}$", message = "Name must start with a capital letter and be followed by lowercase letters with max 20 characters")
        val name: String,

        @field:Pattern(regexp = "^[A-Z][a-z-]{1,29}$", message = "Surname must start with a capital letter and be followed by lowercase letters with max 30 characters")
        val surname: String,

        @field:NotNull(message = "Room is required")
        val room: RoomEntity,

        @field:NotBlank(message = "Check-in date is required")
        @field:Pattern(
            regexp = "\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}Z",
            message = "Check-in date must be in ISO 8601 format (e.g., 2025-04-21T14:00:00Z)"
        )
        val checkInDate: String,

        @field:NotBlank(message = "Check-out date is required")
        @field:Pattern(
            regexp = "\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}Z",
            message = "Check-out date must be in ISO 8601 format (e.g., 2025-04-22T10:00:00Z)"
        )
        val checkOutDate: String
    )

    data class AddUserResponse(val username: String, val password: String)

    @PostMapping("/secured/add/guest")
    @ResponseStatus(HttpStatus.CREATED)
    fun addGuest(@RequestBody user: AddUserRequest): AddUserResponse {
        val username: String = userService.generateUsername(user)
        val password: String = userService.generatePassword(user)
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
        userService.save(guest)
        return AddUserResponse(password = password, username = username)
    }

    @PostMapping("/secured/admin")
    fun addAdmin(@RequestBody user: AddUserRequest){

    }

    @PostMapping("/secured/employee")
    fun addEmployee(@RequestBody user: AddUserRequest){

    }
}