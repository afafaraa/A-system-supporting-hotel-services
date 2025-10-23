package inzynierka.myhotelassistant.services

import inzynierka.myhotelassistant.models.user.UserEntity
import inzynierka.myhotelassistant.repositories.UserRepository
import inzynierka.myhotelassistant.utils.email.EmailSender
import inzynierka.myhotelassistant.utils.email.EmailVerificationTokenUtil
import org.junit.jupiter.api.Assertions.assertFalse
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.mockito.InjectMocks
import org.mockito.Mock
import org.mockito.Mockito.any
import org.mockito.Mockito.anyString
import org.mockito.Mockito.mock
import org.mockito.Mockito.never
import org.mockito.Mockito.verify
import org.mockito.Mockito.`when`
import org.mockito.MockitoAnnotations
import org.springframework.security.oauth2.jwt.Jwt
import java.util.Optional

class EmailVerificationServiceTest {
    @Mock
    private lateinit var userRepository: UserRepository

    @Mock
    private lateinit var tokenUtil: EmailVerificationTokenUtil

    @Mock
    private lateinit var emailSender: EmailSender

    @InjectMocks
    private lateinit var emailVerificationService: EmailVerificationService

    @BeforeEach
    fun setup() {
        MockitoAnnotations.openMocks(this)
    }

    @Test
    fun `sendVerificationLink should generate token and send email`() {
        // Given
        val userId = "user123"
        val email = "test@example.com"
        val token = "generated-token"

        `when`(tokenUtil.generateVerificationToken(userId, email)).thenReturn(token)

        // When
        emailVerificationService.sendVerificationLink(userId, email)

        // Then
        verify(tokenUtil).generateVerificationToken(userId, email)
        verify(emailSender).sendVerificationEmail(email, token)
    }

    @Test
    fun `verifyEmailToken should return true and authorize user when token is valid`() {
        // Given
        val token = "valid-token"
        val userId = "user123"
        val email = "test@example.com"

        val mockJwt = mock(Jwt::class.java)
        `when`(mockJwt.subject).thenReturn(userId)
        `when`(mockJwt.getClaimAsString("email")).thenReturn(email)

        val user =
            UserEntity(
                id = userId,
                email = email,
                username = "testuser",
                password = "hashedpassword",
                name = "Test",
                surname = "User",
                emailAuthorized = false,
            )

        `when`(tokenUtil.validateVerificationToken(token)).thenReturn(mockJwt)
        `when`(userRepository.findById(userId)).thenReturn(Optional.of(user))
        `when`(userRepository.save(any(UserEntity::class.java))).thenReturn(user)

        // When
        val result = emailVerificationService.verifyEmailToken(token)

        // Then
        assertTrue(result)
        assertTrue(user.emailAuthorized)
        verify(userRepository).save(user)
    }

    @Test
    fun `verifyEmailToken should return false when token is invalid`() {
        // Given
        val token = "invalid-token"
        `when`(tokenUtil.validateVerificationToken(token)).thenReturn(null)

        // When
        val result = emailVerificationService.verifyEmailToken(token)

        // Then
        assertFalse(result)
        verify(userRepository, never()).findById(anyString())
        verify(userRepository, never()).save(any(UserEntity::class.java))
    }

    @Test
    fun `verifyEmailToken should return false when user not found`() {
        // Given
        val token = "valid-token"
        val userId = "user123"
        val email = "test@example.com"

        val mockJwt = mock(Jwt::class.java)
        `when`(mockJwt.subject).thenReturn(userId)
        `when`(mockJwt.getClaimAsString("email")).thenReturn(email)

        `when`(tokenUtil.validateVerificationToken(token)).thenReturn(mockJwt)
        `when`(userRepository.findById(userId)).thenReturn(Optional.empty())

        // When
        val result = emailVerificationService.verifyEmailToken(token)

        // Then
        assertFalse(result)
        verify(userRepository, never()).save(any(UserEntity::class.java))
    }

    @Test
    fun `verifyEmailToken should return false when email does not match`() {
        // Given
        val token = "valid-token"
        val userId = "user123"
        val tokenEmail = "token@example.com"
        val userEmail = "user@example.com"

        val mockJwt = mock(Jwt::class.java)
        `when`(mockJwt.subject).thenReturn(userId)
        `when`(mockJwt.getClaimAsString("email")).thenReturn(tokenEmail)

        val user =
            UserEntity(
                id = userId,
                email = userEmail,
                username = "testuser",
                password = "hashedpassword",
                name = "Test",
                surname = "User",
                emailAuthorized = false,
            )

        `when`(tokenUtil.validateVerificationToken(token)).thenReturn(mockJwt)
        `when`(userRepository.findById(userId)).thenReturn(Optional.of(user))

        // When
        val result = emailVerificationService.verifyEmailToken(token)

        // Then
        assertFalse(result)
        assertFalse(user.emailAuthorized)
        verify(userRepository, never()).save(any(UserEntity::class.java))
    }
}
