package inzynierka.myhotelassistant.models

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document
import java.time.Instant

@Document(collection = "registration_codes")
data class RegistrationCode(
    @Id val id: String? = null,
    val userId: String,
    val code: String,
    val createdAt: Instant = Instant.now(),
    val expiresAt: Instant,
    var used: Boolean = false
)