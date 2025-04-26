package inzynierka.myhotelassistant.controllers

import inzynierka.myhotelassistant.services.TokenService
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController

@RestController
class AuthController(private val tokenService: TokenService,
                     private val authManager: AuthenticationManager) {

    data class LoginRequest(val username: String, val password: String)

    @PostMapping("/token")
    fun token(@RequestBody userLogin: LoginRequest): String {
        val authToken = UsernamePasswordAuthenticationToken(userLogin.username, userLogin.password)
        val authentication = authManager.authenticate(authToken)
        return tokenService.generateToken(authentication)
    }
}
