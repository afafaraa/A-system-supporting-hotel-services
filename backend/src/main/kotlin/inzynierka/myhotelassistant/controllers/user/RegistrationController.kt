package inzynierka.myhotelassistant.controllers.user

import inzynierka.myhotelassistant.models.RegistrationCode
import inzynierka.myhotelassistant.models.UserEntity
import inzynierka.myhotelassistant.services.RegistrationCodeService
import inzynierka.myhotelassistant.services.UserService
import org.springframework.http.HttpStatus
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.web.bind.annotation.*

@RestController
class RegistrationController(
    private val codeService: RegistrationCodeService,
    private val userService: UserService,
    private val passwordEncoder: PasswordEncoder
) {


    data class GenerateCodeRequest(val userId: String)
    data class GenerateCodeResponse(val code: String)

    data class CompleteRegistrationRequest(
        val code: String,
        val username: String,
        val password: String
    )
    @PostMapping("/secured/generate-code")
    @ResponseStatus(HttpStatus.OK)
    fun generateCode(@RequestBody req: GenerateCodeRequest): GenerateCodeResponse{
        val user: UserEntity = userService.findById(req.userId)
            ?: throw IllegalArgumentException("User with id=${req.userId} not found")

        val code = codeService.generateCodeForUser(user.id!!)
        return GenerateCodeResponse(code)
    }
    @PostMapping("/open/register")
    @ResponseStatus(HttpStatus.CREATED)
    fun completeRegistration(@RequestBody req: CompleteRegistrationRequest) {
        val rc: RegistrationCode = codeService.validateCode(req.code)

        val user: UserEntity = userService.findById(rc.userId)
            ?: throw IllegalStateException("Konto nie istnieje for code=${req.code}")

        user.username = req.username
        user.password = passwordEncoder.encode(req.password)

        userService.save(user)
        codeService.markUsed(rc)
    }
}