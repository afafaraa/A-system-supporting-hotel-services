package inzynierka.myhotelassistant.repositories

import inzynierka.myhotelassistant.models.service.ServiceEntity
import inzynierka.myhotelassistant.models.service.ServiceTypeAttributes
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.stereotype.Repository

@Repository
interface ServiceRepository : MongoRepository<ServiceEntity, String> {
    fun findAllByDisabledFalse(pageable: Pageable): Page<ServiceEntity>

    fun findFirstByNameIgnoreCase(name: String): ServiceEntity?

    data class ServiceDetails(
        val name: String,
        val image: String?,
        val price: Double,
    )

    fun findServiceDetailsById(id: String): ServiceDetails?

    data class ServiceAttributes(
        val attributes: ServiceTypeAttributes?,
    )

    fun findServiceAttributesById(id: String): ServiceAttributes?
}
