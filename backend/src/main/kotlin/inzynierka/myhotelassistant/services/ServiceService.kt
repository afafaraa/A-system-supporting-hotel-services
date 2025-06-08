package inzynierka.myhotelassistant.services

import inzynierka.myhotelassistant.exceptions.HttpException.EntityNotFoundException
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

    fun findByIdOrThrow(id: String): ServiceEntity =
        serviceRepository
            .findById(id)
            .orElseThrow { EntityNotFoundException("Service not found") }

    fun findByName(name: String): ServiceEntity? =
        serviceRepository
            .findFirstByNameIgnoreCase(name)

    fun save(service: ServiceEntity): ServiceEntity = serviceRepository.save(service)

    fun getSchedulesByIds(ids: List<String>): Map<String, ServiceEntity> {
        if (ids.isEmpty()) return emptyMap()
        return serviceRepository.findAllById(ids).associateBy { it.id!! }
    }
}
