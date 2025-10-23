package inzynierka.myhotelassistant.utils.email

import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.Assertions.assertNull
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.mockito.Mock
import org.mockito.Mockito.any
import org.mockito.Mockito.mock
import org.mockito.Mockito.verify
import org.mockito.Mockito.`when`
import org.mockito.MockitoAnnotations
import org.springframework.security.oauth2.jwt.Jwt
import org.springframework.security.oauth2.jwt.JwtDecoder
import org.springframework.security.oauth2.jwt.JwtEncoder
import org.springframework.security.oauth2.jwt.JwtEncoderParameters
import org.springframework.security.oauth2.jwt.JwtException

class EmailVerificationTokenUtilTest {
    @Mock
    private lateinit var jwtEncoder: JwtEncoder

    @Mock
    private lateinit var jwtDecoder: JwtDecoder

    private lateinit var tokenUtil: EmailVerificationTokenUtil

    @BeforeEach
    fun setup() {
        MockitoAnnotations.openMocks(this)
        tokenUtil = EmailVerificationTokenUtil(jwtEncoder, jwtDecoder)
    }

    @Test
    fun `generateVerificationToken should create token with correct claims`() {
        // Given
        val userId = "user123"
        val email = "test@example.com"
        val tokenValue = "encoded-jwt-token"

        val mockJwt = mock(Jwt::class.java)
        `when`(mockJwt.tokenValue).thenReturn(tokenValue)
        `when`(jwtEncoder.encode(any(JwtEncoderParameters::class.java))).thenReturn(mockJwt)

        // When
        val result = tokenUtil.generateVerificationToken(userId, email)

        // Then
        assertEquals(tokenValue, result)
        verify(jwtEncoder).encode(any(JwtEncoderParameters::class.java))
    }

    @Test
    fun `generateVerificationToken should use custom expiration time`() {
        // Given
        val userId = "user123"
        val email = "test@example.com"
        val expiresMinutes = 30L
        val tokenValue = "encoded-jwt-token"

        val mockJwt = mock(Jwt::class.java)
        `when`(mockJwt.tokenValue).thenReturn(tokenValue)
        `when`(jwtEncoder.encode(any(JwtEncoderParameters::class.java))).thenReturn(mockJwt)

        // When
        val result = tokenUtil.generateVerificationToken(userId, email, expiresMinutes)

        // Then
        assertEquals(tokenValue, result)
        verify(jwtEncoder).encode(any(JwtEncoderParameters::class.java))
    }

    @Test
    fun `validateVerificationToken should return jwt when token is valid`() {
        // Given
        val token = "valid-token"
        val mockJwt = mock(Jwt::class.java)

        `when`(mockJwt.getClaimAsString("type")).thenReturn("VERIFY")
        `when`(jwtDecoder.decode(token)).thenReturn(mockJwt)

        // When
        val result = tokenUtil.validateVerificationToken(token)

        // Then
        assertNotNull(result)
        assertEquals(mockJwt, result)
        verify(jwtDecoder).decode(token)
    }

    @Test
    fun `validateVerificationToken should return null when token type is not VERIFY`() {
        // Given
        val token = "access-token"
        val mockJwt = mock(Jwt::class.java)

        `when`(mockJwt.getClaimAsString("type")).thenReturn("ACCESS")
        `when`(jwtDecoder.decode(token)).thenReturn(mockJwt)

        // When
        val result = tokenUtil.validateVerificationToken(token)

        // Then
        assertNull(result)
        verify(jwtDecoder).decode(token)
    }

    @Test
    fun `validateVerificationToken should return null when token is expired`() {
        // Given
        val token = "expired-token"
        `when`(jwtDecoder.decode(token)).thenThrow(JwtException::class.java)

        // When
        val result = tokenUtil.validateVerificationToken(token)

        // Then
        assertNull(result)
        verify(jwtDecoder).decode(token)
    }

    @Test
    fun `validateVerificationToken should return null when token is invalid`() {
        // Given
        val token = "invalid-token"
        `when`(jwtDecoder.decode(token)).thenThrow(RuntimeException("Invalid token"))

        // When
        val result = tokenUtil.validateVerificationToken(token)

        // Then
        assertNull(result)
        verify(jwtDecoder).decode(token)
    }
}
