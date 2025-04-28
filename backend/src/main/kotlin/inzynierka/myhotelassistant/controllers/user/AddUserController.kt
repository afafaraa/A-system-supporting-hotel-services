package inzynierka.myhotelassistant.controllers.user

import inzynierka.myhotelassistant.models.room.RoomEntity
import inzynierka.myhotelassistant.services.UserService
import jakarta.validation.Valid
import jakarta.validation.constraints.Email
import jakarta.validation.constraints.Size
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Pattern
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController

@RestController
class AddUserController(
    private val userService: UserService,
) {

    data class AddUserRequest(
        @field:Email(message = "Email should be valid")
        val email: String,

        @field:Pattern(
            regexp = "^[A-Za-z-]{2,20}$",
            message = "Name must be 2-20 characters long and may include '-'.")
        val name: String,

        @field:Pattern(
            regexp = "^[A-Za-z-]{2,30}$",
            message = "Surname must be 2-30 characters long and may include '-'.")
        val surname: String,

        @field:NotNull(message = "Room is required")
        val room: RoomEntity,

        @field:Pattern(
            regexp = "\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}Z",
            message = "Check-in date must be in ISO 8601 format (e.g., 2025-04-21T14:00:00Z)"
        ) val checkInDate: String,

        @field:Pattern(
            regexp = "\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}Z",
            message = "Check-out date must be in ISO 8601 format (e.g., 2025-04-22T10:00:00Z)"
        ) val checkOutDate: String
    )

    data class AddUserResponse(val username: String, val password: String)

    @PostMapping("/secured/add/guest")
    @ResponseStatus(HttpStatus.CREATED)
    fun addGuest(@RequestBody user: AddUserRequest): AddUserResponse {
        return userService.createAndSaveGuest(user)
    }

    data class NewAdminRequest(
        @field:Email(message = "Email should be valid")
        val email: String,

        @field:Pattern(
            regexp = "^[A-Za-z-]{2,20}$",
            message = "Name must be 2-20 characters long and may include '-'.")
        val name: String,

        @field:Pattern(
            regexp = "^[A-Za-z-]{2,30}$",
            message = "Surname must be 2-30 characters long and may include '-'.")
        val surname: String,

        @field:Size(min = 8, message = "Password must be at least 8 characters long")
        val password: String
    )

    @PostMapping("/secured/admin")
    @ResponseStatus(HttpStatus.CREATED)
    fun addAdmin(@RequestBody @Valid request: NewAdminRequest): AddUserResponse {
        val newAdmin = userService.createAdmin(request)
        val savedAdmin = userService.save(newAdmin)
        return AddUserResponse(password = savedAdmin.password, username = savedAdmin.username!!)
    }
}
