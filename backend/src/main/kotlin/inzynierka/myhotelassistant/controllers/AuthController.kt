package inzynierka.myhotelassistant.controllers

import inzynierka.myhotelassistant.exceptions.HttpException
import inzynierka.myhotelassistant.services.TokenService
import inzynierka.myhotelassistant.services.UserService
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController

@RestController
class AuthController(private val tokenService: TokenService,
                     private val authManager: AuthenticationManager,
                     private val userService: UserService,
) {

    data class LoginRequest(val username: String, val password: String)
    data class LoginResponse(val accessToken: String?, val refreshToken: String?)
    data class RefreshRequest(val refreshToken: String)
    data class ResetPasswordRequest(val newPassword: String, val token: String)
    data class SendResetPasswordEmailRequest(val email: String)

    @PostMapping("/token")
    fun token(@RequestBody userLogin: LoginRequest): LoginResponse {
        val authToken = UsernamePasswordAuthenticationToken(userLogin.username, userLogin.password)
        val authentication = authManager.authenticate(authToken)
        val accessToken = tokenService.generateAccessToken(authentication)
        val refreshToken = tokenService.generateRefreshToken(authentication)
        return LoginResponse(accessToken, refreshToken)
    }

    @PostMapping("/refresh")
    fun refresh(@RequestBody request: RefreshRequest): LoginResponse {
        val authentication = tokenService.refreshToken(request.refreshToken)
        val accessToken = tokenService.generateAccessToken(authentication)
        val refreshToken = tokenService.generateRefreshToken(authentication)
        return LoginResponse(accessToken, refreshToken)
    }


    @PostMapping("/open/send-reset-password-email")
    fun sendResetPasswordEmail(@RequestBody sendResetPasswordEmailRequest: SendResetPasswordEmailRequest) {
        val user = this.userService.findByEmail(sendResetPasswordEmailRequest.email)
        if (user == null) {
            throw UsernameNotFoundException("User not found")
        }
        val token = tokenService.generateResetPasswordToken(60 * 10, sendResetPasswordEmailRequest.email)
        // todo generated link will be sent by email to user, after clicking on it, it will show reset pass page
        println("http://localhost:5713/reset-password/$token")
    }

    @PostMapping("/open/reset-password")
    fun resetPassword(@RequestBody resetPasswordRequest: ResetPasswordRequest) {
        val email = tokenService.validateResetPasswordToken(resetPasswordRequest.token)
        println(email)
        userService.resetPassword(email, resetPasswordRequest.newPassword)
    }
}