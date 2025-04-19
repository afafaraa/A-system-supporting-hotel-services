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
class GuestController(private val userService: UserService, private val passwordEncoder: PasswordEncoder) {

    data class AddUserRequest(
        val email: String,
        val name: String,
        val surname: String,
        val room: RoomEntity,
        val checkInDate: String,
        val checkOutDate: String
    )

    data class AddUserResponse(
        val username: String,
        val password: String
    )

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

    @PostMapping("/secured/add/guest")
    @ResponseStatus(HttpStatus.CREATED)
    fun addGuest(@RequestBody user: AddUserRequest): AddUserResponse {
        val username: String = generateUsername(user)
        val password: String = generatePassword(user)
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
}