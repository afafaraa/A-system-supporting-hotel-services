package inzynierka.myhotelassistant.controllers

import inzynierka.myhotelassistant.services.TokenService
import inzynierka.myhotelassistant.services.UserService
import org.springframework.http.HttpStatus
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/open")
class AuthController(
    private val tokenService: TokenService,
    private val authManager: AuthenticationManager,
    private val userService: UserService,
) {

    data class LoginResponse(val accessToken: String?, val refreshToken: String?)

    data class LoginRequest(val username: String, val password: String)

    @PostMapping("/token")
    fun getToken(@RequestBody userLogin: LoginRequest): LoginResponse {
        val authToken = UsernamePasswordAuthenticationToken(userLogin.username, userLogin.password)
        val authentication = authManager.authenticate(authToken)
        return LoginResponse(
            accessToken  = tokenService.generateAccessToken(authentication),
            refreshToken = tokenService.generateRefreshToken(authentication)
        )
    }

    data class RefreshRequest(val refreshToken: String)

    @PostMapping("/refresh")
    fun refresh(@RequestBody req: RefreshRequest): LoginResponse {
        val authentication = tokenService.refreshToken(req.refreshToken)
        return LoginResponse(
            accessToken  = tokenService.generateAccessToken(authentication),
            refreshToken = tokenService.generateRefreshToken(authentication),
        )
    }

    data class EmailRequest(val email: String)

    @PostMapping("/send-reset-password-email")
    fun sendResetPasswordEmail(@RequestBody req: EmailRequest) {
        val user = userService.findByEmailOrThrow(req.email)
        val token = tokenService.generateResetPasswordToken(10, req.email)
        // todo generated link will be sent by email to user, after clicking on it, it will show reset pass page
        println("http://localhost:5173/reset-password/$token")
    }

    data class ResetPasswordRequest(val newPassword: String, val token: String)

    @PostMapping("/reset-password")
    fun resetPassword(@RequestBody resetPasswordRequest: ResetPasswordRequest) {
        val email = tokenService.validateResetPasswordToken(resetPasswordRequest.token)
        println(email)
        userService.resetPassword(email, resetPasswordRequest.newPassword)
    }

    data class CompleteRegistrationRequest(val code: String, val username: String, val password: String)

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    fun completeRegistration(@RequestBody req: CompleteRegistrationRequest): LoginResponse {
        userService.completeRegistration(req)
        return getToken(LoginRequest(req.username, req.password))
    }
}
