package inzynierka.myhotelassistant.controllers.user

import inzynierka.myhotelassistant.models.user.Role
import inzynierka.myhotelassistant.models.user.UserEntity
import inzynierka.myhotelassistant.models.room.RoomEntity
import inzynierka.myhotelassistant.services.UserService
import org.springframework.http.HttpStatus
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController
import java.security.MessageDigest
import java.time.Instant

@RestController
class AddUserController(private val userService: UserService, private val passwordEncoder: PasswordEncoder) {

    data class AddUserRequest(
        val email: String,
        val name: String,
        val surname: String,
        val room: RoomEntity,
        val checkInDate: String,
        val checkOutDate: String
    )

    data class AddAdminRequest(
        val email: String,
        val name: String,
        val surname: String,
        val password: String
    )

    data class AddUserResponse(
        val username: String,
        val password: String
    )


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

    @PostMapping("/secured/add/admin")
    @ResponseStatus(HttpStatus.CREATED)
    fun addAdmin(@RequestBody request: AddAdminRequest): AddUserResponse{
        val username = "admin " + request.name
        val password = passwordEncoder.encode(request.password)
        val admin = UserEntity(
            // Używamy danych przekazanych w żądaniu
            username = "admin "+ request.name,
            password = password,
            email = request.email,
            name = request.name,
            surname = request.surname,
            room = null,
            roles = mutableSetOf(Role.ADMIN),
            checkInDate = null,
            checkOutDate = null
        )
        userService.save(admin)
        return AddUserResponse(password = password, username = username)
    }

    @PostMapping("/secured/employee")
    fun addEmployee(@RequestBody user: AddUserRequest){

    }
}