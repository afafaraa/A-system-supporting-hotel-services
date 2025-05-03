package inzynierka.myhotelassistant.services

import inzynierka.myhotelassistant.models.service.ServiceEntity
import inzynierka.myhotelassistant.repositories.ServiceRepository
import org.springframework.stereotype.Service
import java.util.Optional

@Service
class ServiceService(private val serviceRepository: ServiceRepository)  {
    fun findByName(name: String) : ServiceEntity? {
        return serviceRepository.findAll()
            .find { it.name.equals(name, true) }
    }

    fun save(service: ServiceEntity): ServiceEntity {
        return serviceRepository.save(service);
    }

    fun findById(id: String) : Optional<ServiceEntity?> {
        return serviceRepository.findById(id);
    }

    fun findAll() : List<ServiceEntity> {
        return serviceRepository.findAll();
    }
}