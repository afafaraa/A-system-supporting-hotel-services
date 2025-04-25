package inzynierka.myhotelassistant.controllers

import inzynierka.myhotelassistant.models.RegistrationCode
import inzynierka.myhotelassistant.models.UserEntity
import inzynierka.myhotelassistant.services.RegistrationCodeService
import inzynierka.myhotelassistant.services.TokenService
import inzynierka.myhotelassistant.services.UserService
import org.springframework.http.HttpStatus
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController

@RestController
class AuthController(
    private val tokenService: TokenService,
    private val authManager: AuthenticationManager,
    private val userService: UserService,
    private val codeService: RegistrationCodeService,
    private val passwordEncoder: PasswordEncoder
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
        println("http://localhost:5173/reset-password/$token")
    }

    @PostMapping("/open/reset-password")
    fun resetPassword(@RequestBody resetPasswordRequest: ResetPasswordRequest) {
        val email = tokenService.validateResetPasswordToken(resetPasswordRequest.token)
        println(email)
        userService.resetPassword(email, resetPasswordRequest.newPassword)
    }

    data class CompleteRegistrationRequest(
        val code: String, val username: String, val password: String
    )

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    fun completeRegistration(@RequestBody req: CompleteRegistrationRequest): LoginResponse {
        val rc: RegistrationCode = codeService.validateCode(req.code)

        val user: UserEntity =
            userService.findById(rc.userId) ?: throw IllegalStateException("No existing account for code: ${req.code}")

        user.username = req.username
        user.password = passwordEncoder.encode(req.password)

        userService.save(user)
        codeService.markUsed(rc)
        return token(LoginRequest(user.username, req.password))

    }
}