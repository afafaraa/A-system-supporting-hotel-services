package inzynierka.myhotelassistant.controllers.services

import inzynierka.myhotelassistant.models.service.ServiceEntity
import inzynierka.myhotelassistant.services.ServiceService
import org.springframework.data.domain.PageRequest
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/services")
class ServiceController(
    private val serviceService: ServiceService,
) {
    @GetMapping("/available")
    @ResponseStatus(HttpStatus.OK)
    fun getAvailableServices(
        @RequestParam(defaultValue = "0") page: Int,
        @RequestParam(defaultValue = "20") size: Int,
    ): List<ServiceEntity> {
        val pageable = PageRequest.of(page, size)
        return serviceService.getAllAvailable(pageable)
    }

    @GetMapping("/one/{id}")
    @ResponseStatus(HttpStatus.OK)
    fun getServiceById(@PathVariable id: String) = serviceService.findByIdOrThrow(id)
}
