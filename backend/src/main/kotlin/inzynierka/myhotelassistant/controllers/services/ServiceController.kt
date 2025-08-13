package inzynierka.myhotelassistant.controllers.services

import inzynierka.myhotelassistant.models.service.Rating
import inzynierka.myhotelassistant.models.service.ServiceEntity
import inzynierka.myhotelassistant.services.ScheduleService
import inzynierka.myhotelassistant.services.ServiceService
import inzynierka.myhotelassistant.services.UserService
import org.springframework.data.domain.PageRequest
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/services")
class ServiceController(
    private val serviceService: ServiceService,
    private val userService: UserService,
    private val scheduleService: ScheduleService,
) {
    data class RateServiceRequestBody(
        val scheduleId: String,
        val username: String,
        val comment: String,
        val rating: Int,
    )

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
    fun getServiceById(
        @PathVariable id: String,
    ) = serviceService.findByIdOrThrow(id)

    @PostMapping("/rate")
    @ResponseStatus(HttpStatus.OK)
    fun rateService(
        @RequestBody req: RateServiceRequestBody,
    ) {
        val guest = userService.findByUsernameOrThrow(req.username)
        val serviceId = scheduleService.findByIdOrThrow(req.scheduleId).serviceId
        val service = serviceService.findByIdOrThrow(serviceId)
        service.rating.add(Rating(guest.name + " " + guest.surname, req.rating, req.comment))
        serviceService.save(service)
    }
}
