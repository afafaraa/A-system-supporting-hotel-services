package inzynierka.myhotelassistant.repositories

import inzynierka.myhotelassistant.models.notification.NotificationEntity
import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.stereotype.Repository
import java.time.Instant

@Repository
interface NotificationRepository : MongoRepository<NotificationEntity, String> {

    fun findAllByUserIdOrderByCreatedAtDesc(userId: String): List<NotificationEntity>

    fun deleteAllByIsReadTrueAndReadAtBefore(before: Instant): Long

    fun deleteAllByUserIdAndIdIn(userId: String, ids: List<String>): Int
}
