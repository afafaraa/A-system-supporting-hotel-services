package inzynierka.myhotelassistant.controllers.services

import inzynierka.myhotelassistant.models.service.ServiceEntity
import inzynierka.myhotelassistant.repositories.ServiceRepository
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/services")
class ServicesController(
    private val serviceRepository: ServiceRepository
) {

    @GetMapping("/available")
    fun getAvailableServices() : List<ServiceEntity> {
        return serviceRepository.findAll().filter { !it.disabled }
    }
}
