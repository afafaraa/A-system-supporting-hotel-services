package inzynierka.myhotelassistant.repositories.management

import inzynierka.myhotelassistant.models.management.SystemSettingsEntity
import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.stereotype.Repository

@Repository
interface SettingsRepository: MongoRepository<SystemSettingsEntity, String> {
}