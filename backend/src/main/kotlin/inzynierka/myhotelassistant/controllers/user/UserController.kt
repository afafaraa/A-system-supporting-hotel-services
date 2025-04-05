package inzynierka.myhotelassistant.controllers.user

import inzynierka.myhotelassistant.repositories.UserRepository
import org.springframework.security.authentication.password.CompromisedPasswordException
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController

@RestController
class UserController(private val userRepository: UserRepository, private val passwordEncoder: PasswordEncoder) {

    @PutMapping("/email/reset-password")
    fun sendResetPasswordEmail(@RequestBody username: String, @RequestBody email: String) {
        val user = userRepository.findByUsername(username)
        if (user == null) {
            throw UsernameNotFoundException("User not found")
        }



    }

    @PostMapping("/reset-password")
    fun resetPassword(@RequestBody password: String) {

    }
}