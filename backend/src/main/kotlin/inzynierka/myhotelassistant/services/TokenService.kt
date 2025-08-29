package inzynierka.myhotelassistant.services

import inzynierka.myhotelassistant.exceptions.HttpException.ResetTokenValidationException
import inzynierka.myhotelassistant.models.JWTType
import org.springframework.security.authentication.BadCredentialsException
import org.springframework.security.core.Authentication
import org.springframework.security.oauth2.jwt.JwtClaimsSet
import org.springframework.security.oauth2.jwt.JwtDecoder
import org.springframework.security.oauth2.jwt.JwtEncoder
import org.springframework.security.oauth2.jwt.JwtEncoderParameters
import org.springframework.security.oauth2.jwt.JwtException
import org.springframework.stereotype.Service
import java.time.Instant
import java.time.temporal.ChronoUnit
import kotlin.time.Duration
import kotlin.time.Duration.Companion.days
import kotlin.time.Duration.Companion.minutes

@Service
class TokenService(
    private val encoder: JwtEncoder,
    private val decoder: JwtDecoder,
) {
    private val accessValidity = 15.minutes
    private val refreshValidity = 7.days

    private operator fun Instant.plus(duration: Duration): Instant = this.plus(duration.inWholeSeconds, ChronoUnit.SECONDS)

    private data class UserDetails(
        val username: String,
        val roleString: String,
    )

    private fun convertToUserDetails(authentication: Authentication): UserDetails =
        UserDetails(
            username = authentication.name,
            roleString = authentication.authorities.joinToString(" ") { it.authority },
        )

    private fun generateAccessToken(userDetails: UserDetails): String = generateToken(userDetails, accessValidity, JWTType.ACCESS)

    fun generateAccessToken(authentication: Authentication): String {
        val userDetails = convertToUserDetails(authentication)
        return generateToken(userDetails, accessValidity, JWTType.ACCESS)
    }

    fun generateRefreshToken(authentication: Authentication): String {
        val userDetails = convertToUserDetails(authentication)
        return generateToken(userDetails, refreshValidity, JWTType.REFRESH)
    }

    private fun generateToken(
        userDetails: UserDetails,
        duration: Duration,
        type: JWTType,
    ): String {
        val now: Instant = Instant.now()
        val claims =
            JwtClaimsSet
                .builder()
                .claim("type", type)
                .issuedAt(now)
                .expiresAt(now + duration)
                .subject(userDetails.username)
                .claim("role", userDetails.roleString)
                .build()
        return encoder.encode(JwtEncoderParameters.from(claims)).tokenValue
    }

    fun refreshToken(refreshToken: String): String {
        val jwt = try { decoder.decode(refreshToken) }
        catch (e: JwtException) { throw BadCredentialsException("Invalid refresh token: ${e.message}") }
        val type = jwt.getClaimAsString("type")
        if (type != JWTType.REFRESH.name) {
            throw BadCredentialsException("Invalid token type: expected REFRESH, got $type")
        }
        return generateAccessToken(
            UserDetails(
                username = jwt.subject,
                roleString = jwt.getClaimAsString("role"),
            ),
        )
    }

    fun generateResetPasswordToken(
        minutesValid: Long,
        email: String,
    ): String {
        val now: Instant = Instant.now()
        val claims =
            JwtClaimsSet
                .builder()
                .claim("type", JWTType.RESET_PASSWORD)
                .expiresAt(now + minutesValid.minutes)
                .claim("email", email)
                .build()
        return encoder.encode(JwtEncoderParameters.from(claims)).tokenValue
    }

    fun validateResetPasswordToken(token: String): String {
        val jwt = try { decoder.decode(token) }
        catch (e: JwtException) { throw BadCredentialsException("Invalid refresh token: ${e.message}") }

        if (jwt.expiresAt?.isBefore(Instant.now()) ?: true) {
            throw ResetTokenValidationException("Token expired")
        }

        if (jwt.getClaimAsString("type") != JWTType.RESET_PASSWORD.name) {
            throw ResetTokenValidationException("Invalid token type")
        }

        return jwt.getClaimAsString("email")
            ?: throw ResetTokenValidationException("Invalid token: missing email")
    }
}
