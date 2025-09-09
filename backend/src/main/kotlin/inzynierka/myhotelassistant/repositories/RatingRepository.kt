package inzynierka.myhotelassistant.repositories

import inzynierka.myhotelassistant.models.service.RatingEntity
import org.springframework.data.mongodb.repository.MongoRepository

interface RatingRepository : MongoRepository<RatingEntity, String> {

    fun findAllByServiceId(serviceId: String): List<RatingEntity>
}