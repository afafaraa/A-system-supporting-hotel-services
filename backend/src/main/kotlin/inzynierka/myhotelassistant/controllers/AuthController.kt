package inzynierka.myhotelassistant.controllers

import inzynierka.myhotelassistant.configs.AppProperties
import inzynierka.myhotelassistant.exceptions.UnauthorizedException
import inzynierka.myhotelassistant.models.user.UserEntity
import inzynierka.myhotelassistant.services.EmailVerificationService
import inzynierka.myhotelassistant.services.TokenService
import inzynierka.myhotelassistant.services.UserService
import inzynierka.myhotelassistant.utils.email.EmailSender
import jakarta.validation.Valid
import jakarta.validation.constraints.Email
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping(value = ["/open"])
class AuthController(
    private val tokenService: TokenService,
    private val authManager: AuthenticationManager,
    private val userService: UserService,
    private val emailSender: EmailSender,
    private val emailVerificationService: EmailVerificationService,
    private val appProperties: AppProperties,
) {
    data class LoginResponse(
        val accessToken: String?,
        val refreshToken: String?,
    )

    data class LoginRequest(
        val username: String,
        val password: String,
    )

    @PostMapping("/token")
    fun getToken(
        @RequestBody userLogin: LoginRequest,
    ): LoginResponse {
        val user =
            userService.findByUsername(userLogin.username)
                ?: throw UnauthorizedException("User not found")

        if (!user.emailAuthorized) {
            throw UnauthorizedException("Please verify your email address before logging in")
        }

        val authToken = UsernamePasswordAuthenticationToken(userLogin.username, userLogin.password)
        val authentication = authManager.authenticate(authToken)
        return LoginResponse(
            accessToken = tokenService.generateAccessToken(authentication),
            refreshToken = tokenService.generateRefreshToken(authentication),
        )
    }

    data class RefreshRequest(
        val refreshToken: String,
    )

    @PostMapping("/refresh")
    fun refreshAccessToken(
        @RequestBody req: RefreshRequest,
    ): LoginResponse =
        LoginResponse(
            accessToken = tokenService.refreshToken(req.refreshToken),
            refreshToken = req.refreshToken,
        )

    data class EmailRequest(
        @field:Email(message = "Email should be valid")
        val email: String,
    )

    @PostMapping("/send-reset-password-email")
    fun sendResetPasswordEmail(
        @RequestBody @Valid req: EmailRequest,
    ) {
        if (userService.findByEmail(req.email) != null) {
            val token = tokenService.generateResetPasswordToken(10, req.email)
            emailSender.sendResetPasswordLink(
                email = req.email,
                link = "${appProperties.frontend.url}/reset-password/$token",
            )
        }
    }

    data class ResetPasswordRequest(
        val newPassword: String,
        val token: String,
    )

    @PostMapping("/reset-password")
    fun resetPassword(
        @RequestBody resetPasswordRequest: ResetPasswordRequest,
    ) {
        val email = tokenService.validateResetPasswordToken(resetPasswordRequest.token)
        userService.changePassword(email, resetPasswordRequest.newPassword)
    }

    data class CompleteRegistrationRequest(
        val code: String,
        val username: String,
        val password: String,
    )

    data class CompleteRegistrationRequestNoCode(
        val username: String,
        val password: String,
        @field:Email(message = "Email should be valid")
        val email: String,
        val name: String,
        val surname: String,
    )

    @PostMapping("/register/with-code")
    @ResponseStatus(HttpStatus.CREATED)
    fun completeRegistration(
        @RequestBody req: CompleteRegistrationRequest,
    ): LoginResponse {
        userService.completeRegistration(req)
        return getToken(LoginRequest(req.username, req.password))
    }

    @PostMapping("/register/no-code")
    @ResponseStatus(HttpStatus.CREATED)
    fun completeRegistrationNoCode(
        @RequestBody @Valid req: CompleteRegistrationRequestNoCode,
    ): ResponseEntity<String> {
        var savedUser: UserEntity;
        try {
            savedUser = userService.completeRegistrationNoCode(req)
            println("Saved user: $savedUser")
        } catch (e: Exception) {
            println("Error during registration: ${e.message}")
            return ResponseEntity.internalServerError().body(e.message)
        }
        try {
            emailVerificationService.sendVerificationLink(savedUser.id!!, savedUser.email)
        } catch (e: Exception) {
            println("Error during registration: ${e.message}")
            return ResponseEntity.internalServerError().body("Couldn't send verification email. Make sure your email is correct and try again.")
        }
        return ResponseEntity.ok("A verification email has been sent to ${savedUser.email}. Please verify your email to complete the registration.")
    }

    @GetMapping("/verify/account")
    fun verifyEmail(
        @RequestParam token: String,
    ): ResponseEntity<String> =
        if (emailVerificationService.verifyEmailToken(token)) {
            ResponseEntity.ok("Email verified successfully. You can now log in.")
        } else {
            ResponseEntity.badRequest().body("Invalid or expired verification link.")
        }

    @PostMapping("/activate")
    fun activateWithCode(
        @RequestBody code: String,
    ) {
        userService.activateWithCode(code)
    }
}
