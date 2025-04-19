package inzynierka.myhotelassistant.controllers.user

import inzynierka.myhotelassistant.repositories.UserRepository
import inzynierka.myhotelassistant.services.TokenService
import inzynierka.myhotelassistant.services.UserService
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.authentication.password.CompromisedPasswordException
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController

@RestController
class UserController(private val userService: UserService, private val passwordEncoder: PasswordEncoder, private val tokenService: TokenService, private val authenticationManager: AuthenticationManager) {

    data class ResetPasswordRequest(val newPassword: String, val token: String)

    @PostMapping("/open/send-reset-password-email")
    fun sendResetPasswordEmail(@RequestBody email: String) {
        val token = tokenService.generateResetPasswordToken(this.userService.findByEmail(email)?.id)
        if (token == null) {
            throw UsernameNotFoundException("Token not found")
        }
        // todo generated link will be sent by email to user, after clicking on it, it will show reset pass page
        println("http://localhost:5713/rese-password/$token")
    }

    @PostMapping("/open/reset-password")
    fun resetPassword(@RequestBody resetPasswordRequest: ResetPasswordRequest) {
        val token = tokenService.findByTokenValue(resetPasswordRequest.token)
        if (token == null){
            return
        }
        val username = tokenService.decodeBase64Token(token.token)
        val user = userService.findByUsername(username)
        if (user == null){
            throw UsernameNotFoundException("User not found")
        }
        user.password = passwordEncoder.encode(resetPasswordRequest.newPassword)
        user.let { this.userService.save(it) }
    }

}