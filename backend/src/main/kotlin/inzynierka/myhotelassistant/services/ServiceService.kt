package inzynierka.myhotelassistant.services

import inzynierka.myhotelassistant.models.service.ServiceEntity
import inzynierka.myhotelassistant.repositories.ServiceRepository
import org.springframework.stereotype.Service

@Service
class ServiceService(
    private val serviceRepository: ServiceRepository,
) {
    fun findByName(name: String): ServiceEntity? =
        serviceRepository
            .findAll()
            .find { it.name.equals(name, ignoreCase = true) }

    fun save(service: ServiceEntity): ServiceEntity = serviceRepository.save(service)
}
