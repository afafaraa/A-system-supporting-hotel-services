package inzynierka.myhotelassistant.repositories

import inzynierka.myhotelassistant.models.notification.NotificationEntity
import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.stereotype.Repository

@Repository
interface NotificationRepository: MongoRepository<NotificationEntity, String> {
}
