package inzynierka.myhotelassistant.controllers.user

import inzynierka.myhotelassistant.models.user.UserEntity
import inzynierka.myhotelassistant.services.UserService
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.security.Principal

@RestController
@RequestMapping("/user")
class GetUserController(
    private val userService: UserService,
) {
    @GetMapping
    fun getCurrentUser(principal: Principal): UserEntity = userService.getCurrentUser(principal.name)
}
