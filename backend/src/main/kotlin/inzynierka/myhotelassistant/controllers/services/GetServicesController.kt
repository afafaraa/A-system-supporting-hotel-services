package inzynierka.myhotelassistant.controllers.services

import inzynierka.myhotelassistant.models.service.ServiceEntity
import inzynierka.myhotelassistant.repositories.ServiceRepository
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.GetMapping

@Controller()
class GetServicesController(private val serviceRepository: ServiceRepository) {

    @GetMapping("/services/available/get")
    fun getAvailableServices() : List<ServiceEntity> {
        return serviceRepository.findAll().filter { !it.disabled }
    }
}