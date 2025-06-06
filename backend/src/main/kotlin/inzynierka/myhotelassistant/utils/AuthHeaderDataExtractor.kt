package inzynierka.myhotelassistant.utils

import inzynierka.myhotelassistant.models.user.Role
import org.springframework.security.oauth2.jwt.JwtDecoder
import org.springframework.stereotype.Component

@Component
class AuthHeaderDataExtractor(
    private val jwtDecoder: JwtDecoder,
) {
    data class JwtData(
        val username: String,
        val role: String,
    )

    fun decodeJwtData(authHeader: String): JwtData {
        val token = authHeader.split(" ")[1]
        val jwt = jwtDecoder.decode(token)
        val username = jwt.subject
        val role = jwt.getClaimAsString("role")?.split("_")?.get(1) ?: Role.GUEST.name
        return JwtData(username, role)
    }
}
