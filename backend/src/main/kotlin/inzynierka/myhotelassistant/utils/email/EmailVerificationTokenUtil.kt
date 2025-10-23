package inzynierka.myhotelassistant.utils.email

import org.springframework.security.oauth2.jwt.Jwt
import org.springframework.security.oauth2.jwt.JwtClaimsSet
import org.springframework.security.oauth2.jwt.JwtDecoder
import org.springframework.security.oauth2.jwt.JwtEncoder
import org.springframework.security.oauth2.jwt.JwtEncoderParameters
import org.springframework.stereotype.Component
import java.time.Instant

@Component
class EmailVerificationTokenUtil(
    private val jwtEncoder: JwtEncoder,
    private val jwtDecoder: JwtDecoder,
) {
    fun generateVerificationToken(
        userId: String,
        email: String,
        expiresMinutes: Long = 60 * 24,
    ): String {
        val now = Instant.now()
        val claims =
            JwtClaimsSet
                .builder()
                .subject(userId)
                .claim("email", email)
                .claim("type", "VERIFY") // differentiate from ACCESS / REFRESH tokens
                .issuedAt(now)
                .expiresAt(now.plusSeconds(expiresMinutes * 60))
                .build()

        return jwtEncoder.encode(JwtEncoderParameters.from(claims)).tokenValue
    }

    fun validateVerificationToken(token: String): Jwt? {
        return try {
            val jwt = jwtDecoder.decode(token)
            if (jwt.getClaimAsString("type") != "VERIFY") return null
            jwt
        } catch (e: Exception) {
            null // invalid or expired
        }
    }
}
