package inzynierka.myhotelassistant.repositories

import inzynierka.myhotelassistant.models.service.ServiceEntity
import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.stereotype.Repository

@Repository
interface ServiceRepository : MongoRepository<ServiceEntity, String>
