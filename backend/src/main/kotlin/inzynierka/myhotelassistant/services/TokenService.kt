package inzynierka.myhotelassistant.services

import inzynierka.myhotelassistant.exceptions.HttpException.ResetTokenValidationException
import inzynierka.myhotelassistant.models.JWTType
import org.springframework.security.authentication.BadCredentialsException
import org.springframework.security.core.Authentication
import org.springframework.security.oauth2.jwt.JwtClaimsSet
import org.springframework.security.oauth2.jwt.JwtDecoder
import org.springframework.security.oauth2.jwt.JwtEncoder
import org.springframework.security.oauth2.jwt.JwtEncoderParameters
import org.springframework.stereotype.Service
import java.time.Instant
import java.time.temporal.ChronoUnit

@Service
class TokenService(
    private val encoder: JwtEncoder,
    private val decoder: JwtDecoder,
) {

    private val accessValidity = 15L to ChronoUnit.MINUTES
    private val refreshValidity = 7L to ChronoUnit.DAYS

    private data class UserDetails(val username: String, val roleString: String)

    private fun convertToUserDetails(authentication: Authentication): UserDetails {
        return UserDetails(
            username = authentication.name,
            roleString = authentication.authorities.joinToString(" ") { it.authority }
        )
    }

    private fun generateAccessToken(userDetails: UserDetails): String {
        return generateToken(userDetails, accessValidity.first, accessValidity.second, JWTType.ACCESS)
    }

    fun generateAccessToken(authentication: Authentication): String {
        val userDetails = convertToUserDetails(authentication)
        return generateToken(userDetails, accessValidity.first, accessValidity.second, JWTType.ACCESS)
    }

    fun generateRefreshToken(authentication: Authentication): String {
        val userDetails = convertToUserDetails(authentication)
        return generateToken(userDetails, refreshValidity.first, refreshValidity.second, JWTType.REFRESH)
    }

    private fun generateToken(userDetails: UserDetails, time: Long, unit: ChronoUnit, type: JWTType): String {
        val now: Instant = Instant.now()
        val claims = JwtClaimsSet.builder()
            .claim("type", type)
            .issuedAt(now)
            .expiresAt(now.plus(time, unit))
            .subject(userDetails.username)
            .claim("role", userDetails.roleString)
            .build()
        return encoder.encode(JwtEncoderParameters.from(claims)).tokenValue
    }

    fun refreshToken(refreshToken: String): String {
        val jwt = decoder.decode(refreshToken)
        val type = jwt.getClaimAsString("type")
        if (type != JWTType.REFRESH.name)
            throw BadCredentialsException("Invalid token type: expected ACCESS, got $type")
        return generateAccessToken(
            UserDetails(
                username = jwt.subject,
                roleString = jwt.getClaimAsString("role")
            )
        )
    }

    fun generateResetPasswordToken(minutesValid: Long, email: String): String {
        val now: Instant = Instant.now()
        val claims = JwtClaimsSet.builder()
            .claim("type", JWTType.RESET_PASSWORD)
            .expiresAt(now.plus(minutesValid, ChronoUnit.MINUTES))
            .claim("email", email)
            .build()
        return encoder.encode(JwtEncoderParameters.from(claims)).tokenValue
    }

    fun validateResetPasswordToken(token: String): String {
        val jwt = decoder.decode(token)

        if (jwt.expiresAt?.isBefore(Instant.now()) ?: true)
            throw ResetTokenValidationException("Token expired")

        if (jwt.getClaimAsString("type") != JWTType.RESET_PASSWORD.name)
            throw ResetTokenValidationException("Invalid token type")

        return jwt.getClaimAsString("email")
            ?: throw ResetTokenValidationException("Invalid token: missing email")
    }
}
