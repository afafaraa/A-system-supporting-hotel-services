package inzynierka.myhotelassistant.repositories

import inzynierka.myhotelassistant.models.RegistrationCode
import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.stereotype.Repository
import java.time.Instant

@Repository
interface RegistrationCodeRepository : MongoRepository<RegistrationCode, String> {
    fun findByCode(code: String): RegistrationCode?
    fun deleteByExpiresAtBefore(time: Instant): Long
}