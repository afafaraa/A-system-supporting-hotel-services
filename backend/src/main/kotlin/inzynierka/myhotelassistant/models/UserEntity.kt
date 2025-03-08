package inzynierka.myhotelassistant.models

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document

@Document(collection = "users")
data class UserEntity(
    @Id val id: String? = null,
    val username: String,
    val password: String,
    val roles: List<Role>
)