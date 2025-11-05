package inzynierka.myhotelassistant.services

import inzynierka.myhotelassistant.repositories.UserRepository
import inzynierka.myhotelassistant.utils.email.EmailSender
import inzynierka.myhotelassistant.utils.email.EmailVerificationTokenUtil
import org.springframework.stereotype.Service

@Service
class EmailVerificationService(
    private val userRepository: UserRepository,
    private val tokenUtil: EmailVerificationTokenUtil,
    private val emailSender: EmailSender,
) {
    fun sendVerificationLink(
        userId: String,
        email: String,
    ) {
        val token = tokenUtil.generateVerificationToken(userId, email)
        try {
            emailSender.sendVerificationEmail(email, token)
        } catch (e: Exception) {
            println("Error during sending verification email: ${e.message}")
            throw IllegalStateException("Couldn't send verification email. Make sure your email is correct and try again.")
        }
    }

    fun verifyEmailToken(token: String): Boolean {
        val jwt = tokenUtil.validateVerificationToken(token) ?: return false

        val userId = jwt.subject
        val email = jwt.getClaimAsString("email")

        val user = userRepository.findById(userId).orElse(null) ?: return false
        if (user.email != email) return false

        user.emailAuthorized = true
        userRepository.save(user)
        return true
    }
}
