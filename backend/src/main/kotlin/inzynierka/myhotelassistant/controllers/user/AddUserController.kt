package inzynierka.myhotelassistant.controllers.user

import inzynierka.myhotelassistant.services.UserService
import jakarta.validation.Valid
import jakarta.validation.constraints.Email
import jakarta.validation.constraints.Pattern
import jakarta.validation.constraints.Size
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController
import java.time.LocalDate

@RestController
class AddUserController(
    private val userService: UserService,
) {
    data class AddUserRequest(
        @field:Email(message = "Email should be valid")
        val email: String,
        @field:Pattern(
            regexp = "^[A-Za-z-]{2,20}$",
            message = "Name must be 2-20 characters long and may include '-'",
        )
        val name: String,
        @field:Pattern(
            regexp = "^[A-Za-z-]{2,30}$",
            message = "Surname must be 2-30 characters long and may include '-'",
        )
        val surname: String,
        @field:Pattern(
            regexp = "^[0-9]{3,4}$",
            message = "Room number must only contain digits and be 3-4 digits long",
        )
        val roomNumber: String,
        val checkInDate: LocalDate,
        val checkOutDate: LocalDate,
    )

    data class AddUserResponse(
        val username: String,
        val password: String,
    )

    @PostMapping("/secured/add/guest")
    @ResponseStatus(HttpStatus.CREATED)
    fun addGuest(
        @RequestBody user: AddUserRequest,
    ): AddUserResponse = userService.createAndSaveGuest(user).second

    data class NewAdminRequest(
        @field:Email(message = "Email should be valid")
        val email: String,
        @field:Pattern(
            regexp = "^[A-Za-z-]{2,20}$",
            message = "Name must be 2-20 characters long and may include '-'.",
        )
        val name: String,
        @field:Pattern(
            regexp = "^[A-Za-z-]{2,30}$",
            message = "Surname must be 2-30 characters long and may include '-'.",
        )
        val surname: String,
        @field:Size(min = 8, message = "Password must be at least 8 characters long")
        val password: String,
    )

    @PostMapping("/secured/admin")
    @ResponseStatus(HttpStatus.CREATED)
    fun addAdmin(
        @RequestBody @Valid request: NewAdminRequest,
    ): AddUserResponse {
        val newAdmin = userService.createAdmin(request)
        val savedAdmin = userService.save(newAdmin)
        return AddUserResponse(password = savedAdmin.password, username = savedAdmin.username)
    }
}
