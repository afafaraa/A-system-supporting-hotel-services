package inzynierka.myhotelassistant.repositories

import inzynierka.myhotelassistant.models.token.TokenEntity
import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.stereotype.Repository

@Repository
interface TokenRepository: MongoRepository<TokenEntity, String> {
    fun findByToken(token: String): TokenEntity?

    fun save(token: TokenEntity): TokenEntity?

}