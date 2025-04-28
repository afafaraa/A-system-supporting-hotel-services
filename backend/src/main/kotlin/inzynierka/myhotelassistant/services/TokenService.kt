package inzynierka.myhotelassistant.services

import inzynierka.myhotelassistant.models.JWTType
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.Authentication
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.oauth2.jwt.JwtClaimsSet
import org.springframework.security.oauth2.jwt.JwtDecoder
import org.springframework.security.oauth2.jwt.JwtEncoder
import org.springframework.security.oauth2.jwt.JwtEncoderParameters
import org.springframework.stereotype.Service
import java.time.Instant
import java.time.temporal.ChronoUnit
import java.util.stream.Collectors

@Service
class TokenService(
    private val encoder: JwtEncoder,
    private val decoder: JwtDecoder
) {

    fun generateAccessToken(authentication: Authentication) =
        generateToken(authentication, 15, ChronoUnit.MINUTES, JWTType.ACCESS)

    fun generateRefreshToken(authentication: Authentication) =
        generateToken(authentication, 7, ChronoUnit.DAYS, JWTType.REFRESH)

    fun generateResetPasswordToken(minutesValid: Long, email: String): String {
        val now: Instant = Instant.now()
        val claims = JwtClaimsSet.builder()
            .claim("type", JWTType.RESET_PASSWORD)
            .issuedAt(now)
            .expiresAt(now.plus(minutesValid, ChronoUnit.MINUTES))
            .claim("email", email)
            .build()
        return encoder.encode(JwtEncoderParameters.from(claims)).tokenValue
    }

    private fun generateToken(authentication: Authentication, time: Long, unit: ChronoUnit, type: JWTType): String {
        val now: Instant = Instant.now()
        val role: String = authentication.authorities.stream() // Collecting roles of the user
            .map(GrantedAuthority::getAuthority)
            .collect(Collectors.joining(" "))
        val claims = JwtClaimsSet.builder()
            .claim("type", type)
            .issuedAt(now)
            .expiresAt(now.plus(time, unit))
            .subject(authentication.name)
            .claim("role", role)
            .build()
        return encoder.encode(JwtEncoderParameters.from(claims)).tokenValue
    }

    fun refreshToken(refreshToken: String): Authentication {
        val jwt = decoder.decode(refreshToken)

        val tokenType = JWTType.valueOf(jwt.getClaimAsString("type"))
        if (tokenType != JWTType.REFRESH)
            throw RuntimeException("Invalid token type")

        val username = jwt.subject
        val authorities = jwt.getClaimAsString("role")
            .split(" ")
            .map { SimpleGrantedAuthority(it) }

        return UsernamePasswordAuthenticationToken(username, null, authorities)
    }

    fun validateResetPasswordToken(token: String): String{
        val jwt = decoder.decode(token)
        println(token)
        if (JWTType.valueOf(jwt.getClaimAsString("type")) != JWTType.RESET_PASSWORD)
            throw RuntimeException("Invalid token type")

        val email = jwt.getClaimAsString("email")
            ?: throw RuntimeException("Invalid token: missing email")

        return email
    }
}
