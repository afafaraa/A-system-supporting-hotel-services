package inzynierka.myhotelassistant.controllers

import inzynierka.myhotelassistant.models.token.TokenEntity
import inzynierka.myhotelassistant.services.TokenService
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestHeader
import org.springframework.web.bind.annotation.RestController

@RestController
class AuthController(private val tokenService: TokenService,
                     private val authManager: AuthenticationManager) {

    data class LoginRequest(val username: String, val password: String)

    data class LoginResponse(val accessToken: String?, val refreshToken: String?)

    @PostMapping("/login")
    fun login(@RequestBody userLogin: LoginRequest): LoginResponse {
        val authToken = UsernamePasswordAuthenticationToken(userLogin.username, userLogin.password)
        val authentication = authManager.authenticate(authToken)
        val accessToken =  tokenService.generateAccessToken(authentication)
        val refreshToken = tokenService.generateRefreshToken(authentication)
        return LoginResponse(accessToken=accessToken, refreshToken=refreshToken)
    }

    @PostMapping("/logout")
    fun logout(@RequestHeader("Authorization") authHeader: String) {
        val token = authHeader.removePrefix("Bearer ").trim()
        tokenService.logout(token)
    }

    @PostMapping("/refresh-token")
    fun refreshToken(@RequestBody refreshToken: String): String? {
        return tokenService.refreshAccessToken(refreshToken)
    }
}