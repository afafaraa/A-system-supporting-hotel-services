package inzynierka.myhotelassistant.models.token

import org.apache.el.parser.Token
import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document
import java.time.Instant

@Document(collection = "token")
data class TokenEntity (
    @Id val id: String? = null,
    val token: String,
    val tokenType: TokenType,
    var tokenUsed: Boolean = false,
    var expired: Boolean = false,
)