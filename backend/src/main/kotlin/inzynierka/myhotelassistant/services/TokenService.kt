package inzynierka.myhotelassistant.services

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.Authentication
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.security.oauth2.jwt.JwtClaimsSet
import org.springframework.security.oauth2.jwt.JwtDecoder
import org.springframework.security.oauth2.jwt.JwtEncoder
import org.springframework.security.oauth2.jwt.JwtEncoderParameters
import org.springframework.stereotype.Service
import java.time.Instant
import java.time.temporal.ChronoUnit
import java.util.stream.Collectors

@Service
class TokenService(private val encoder: JwtEncoder, private val decoder: JwtDecoder,
) {

    fun generateAccessToken(authentication: Authentication): String {
        return generateToken(authentication, 1 * 60 * 15, "access")
    }

    fun generateRefreshToken(authentication: Authentication): String {
        return generateToken(authentication, 7 * 24 * 60 * 60, "refresh")
    }

//    fun generateResetPasswordToken(secondsValid: Long, email: String): String {
//        val user = this.userService.findByEmail(email)
//        if (user == null) {
//            throw UsernameNotFoundException("User not found")
//        }
//        val now: Instant = Instant.now()
//        val claims = JwtClaimsSet.builder()
//            .issuer("self")
//            .issuedAt(now)
//            .expiresAt(now.plus(secondsValid, ChronoUnit.SECONDS))
//            .claim("tokenType", "resetPassword")
//            .claim("email", email)
//            .build()
//        return encoder.encode(JwtEncoderParameters.from(claims)).tokenValue
//    }

    private fun generateToken(authentication: Authentication, secondsValid: Long, tokenType: String): String {
        val now: Instant = Instant.now()
        val scope: String = authentication.authorities.stream() // Collecting roles of the user
            .map(GrantedAuthority::getAuthority)
            .collect(Collectors.joining(" "))
        val claims = JwtClaimsSet.builder()
            .issuer("self")
            .issuedAt(now)
            .expiresAt(now.plus(secondsValid, ChronoUnit.SECONDS))
            .subject(authentication.name)
            .claim("scope", scope)
            .claim("tokenType", tokenType)
            .build()
        return encoder.encode(JwtEncoderParameters.from(claims)).tokenValue
    }

    fun refreshToken(refreshToken: String): Authentication {
        val jwt = decoder.decode(refreshToken)

        val tokenType = jwt.getClaimAsString("tokenType")
        if (tokenType != "refresh") {
            throw RuntimeException("Invalid token type")
        }

        val username = jwt.subject
        val authorities = jwt.getClaimAsString("scope")
            .split(" ")
            .map { SimpleGrantedAuthority(it) }

        return UsernamePasswordAuthenticationToken(username, null, authorities)
    }

//    fun validateResetPasswordToken(token: String) : UserEntity{
//        val jwt = decoder.decode(token)
//
//        if (jwt.getClaimAsString("tokenType") != "resetPassword") {
//            throw RuntimeException("Invalid token type")
//        }
//
//        val email = jwt.getClaimAsString("email")
//            ?: throw RuntimeException("Invalid token: missing email")
//
//        val user = userService.findByEmail(email)
//            ?: throw HttpException.UserNotFoundException("User not found")
//        return user;
//    }
}