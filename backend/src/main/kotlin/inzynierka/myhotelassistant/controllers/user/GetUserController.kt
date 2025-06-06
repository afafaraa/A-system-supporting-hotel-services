package inzynierka.myhotelassistant.controllers.user

import inzynierka.myhotelassistant.models.user.UserEntity
import inzynierka.myhotelassistant.services.UserService
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestHeader
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/user")
class GetUserController(
    private val userService: UserService,
) {
    @GetMapping
    fun getCurrentUser(
        @RequestHeader("Authorization") authHeader: String,
    ): UserEntity = userService.getCurrentUser(authHeader)
}
