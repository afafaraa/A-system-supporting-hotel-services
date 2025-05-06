package inzynierka.myhotelassistant.services

import inzynierka.myhotelassistant.models.service.ServiceEntity
import inzynierka.myhotelassistant.repositories.ServiceRepository
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service
import java.util.Optional

@Service
class ServiceService(
    private val serviceRepository: ServiceRepository,
) {
    fun getAllAvailable(pageable: Pageable): List<ServiceEntity> =
        serviceRepository
            .findAllByDisabledFalse(pageable)
            .content

    fun findAll(): List<ServiceEntity> = serviceRepository.findAll()

    fun findById(id: String): Optional<ServiceEntity> = serviceRepository.findById(id)

    fun findByName(name: String): ServiceEntity? =
        serviceRepository
            .findFirstByNameIgnoreCase(name)

    fun save(service: ServiceEntity): ServiceEntity = serviceRepository.save(service)
}
