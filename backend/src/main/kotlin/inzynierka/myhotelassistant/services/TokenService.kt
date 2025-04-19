package inzynierka.myhotelassistant.services

import inzynierka.myhotelassistant.models.token.TokenEntity
import inzynierka.myhotelassistant.models.token.TokenType
import inzynierka.myhotelassistant.models.user.UserEntity
import inzynierka.myhotelassistant.repositories.TokenRepository
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.Authentication
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.oauth2.jwt.JwtClaimsSet
import org.springframework.security.oauth2.jwt.JwtDecoder
import org.springframework.security.oauth2.jwt.JwtEncoder
import org.springframework.security.oauth2.jwt.JwtEncoderParameters
import org.springframework.stereotype.Service
import java.security.SecureRandom
import java.time.Instant
import java.time.temporal.ChronoUnit
import java.util.*
import java.util.stream.Collectors

@Service
class TokenService(private val encoder: JwtEncoder, private val decoder: JwtDecoder, private val tokenRepository: TokenRepository) {

    fun findByTokenValue(token: String): TokenEntity? {
        return this.tokenRepository.findByToken(token)
    }

    fun generateAccessToken(authentication: Authentication): String? {
        return this.generateToken(authentication, 1, TokenType.ACCESS_TOKEN)
    }

    fun generateRefreshToken(authentication: Authentication): String? {
        return this.generateToken(authentication, 5, TokenType.REFRESH_TOKEN)
    }

    fun generateResetPasswordToken(id: String?): String? {
        if (id == null) {
            return null;
        }
        val encoded = Base64.getUrlEncoder().encodeToString(id.toByteArray())
        val token = encoded.take(16).padEnd(16, '0')
        tokenRepository.save(TokenEntity(token=token, tokenType=TokenType.RESET_PASSWORD_TOKEN))
        return token
    }

    fun decodeBase64Token(token: String): String {
        val paddedToken = token.trimEnd('0') // remove added padding
        val decodedBytes = Base64.getUrlDecoder().decode(paddedToken)
        return String(decodedBytes)
    }

    fun refreshAccessToken(refreshToken: String): String? {
        val token = tokenRepository.findByToken(refreshToken)
        if( token == null || token.expired || token.tokenType != TokenType.REFRESH_TOKEN){
            throw IllegalArgumentException("Invalid refresh token")
        }

        val decodedJwt = decoder.decode(refreshToken)
        val authorities = decodedJwt.getClaimAsString("scope")?.split(" ")?.map {
            SimpleGrantedAuthority(it)
        } ?: emptyList()

        val authentication = UsernamePasswordAuthenticationToken(decodedJwt.subject, null, authorities)

        return generateAccessToken(authentication)
    }

    fun logout(tokenValue: String) {
        val token = tokenRepository.findByToken(tokenValue)
        token?.let {
            it.expired = true
            tokenRepository.save(it)
        }
    }

    private fun generateToken(authentication: Authentication, expirationTime: Long, tokenType: TokenType): String {
        val now: Instant = Instant.now()
        val scope: String = authentication.authorities.stream() // Collecting roles of the user
            .map(GrantedAuthority::getAuthority)
            .collect(Collectors.joining(" "))
        val claims = JwtClaimsSet.builder()
            .issuer("self")
            .issuedAt(now)
            .expiresAt(now.plus(expirationTime, ChronoUnit.HOURS))
            .subject(authentication.name)
            .claim("scope", scope)
            .build()
        val token = encoder.encode(JwtEncoderParameters.from(claims)).tokenValue

        tokenRepository.save(TokenEntity(token=token, tokenType=tokenType))
        return token
    }

}