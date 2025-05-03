package inzynierka.myhotelassistant.controllers.services

import inzynierka.myhotelassistant.models.service.ServiceEntity
import inzynierka.myhotelassistant.repositories.ServiceRepository
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@RestController()
class GetServicesController(private val serviceRepository: ServiceRepository) {

    @GetMapping("/services/available/all")
    fun getAvailableServices() : List<ServiceEntity> {
        return serviceRepository.findAll().filter { !it.disabled }
    }
}