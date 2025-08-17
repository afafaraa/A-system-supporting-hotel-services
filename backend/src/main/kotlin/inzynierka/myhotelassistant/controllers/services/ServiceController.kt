package inzynierka.myhotelassistant.controllers.services

import inzynierka.myhotelassistant.dto.ServiceCreateRequestDTO
import inzynierka.myhotelassistant.dto.ServiceCreateResponseDTO
import inzynierka.myhotelassistant.models.service.Rating
import inzynierka.myhotelassistant.models.service.ServiceEntity
import inzynierka.myhotelassistant.services.ScheduleService
import inzynierka.myhotelassistant.services.ServiceService
import inzynierka.myhotelassistant.services.UserService
import org.springframework.data.domain.PageRequest
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

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
    ): List<ServiceCreateResponseDTO> {
        val pageable = PageRequest.of(page, size)
        val entities = serviceService.getAllAvailable(pageable)
        return entities.map { ServiceCreateResponseDTO.from(it) }
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

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun createService(
        @RequestBody request: ServiceCreateRequestDTO,
    ): ServiceCreateResponseDTO {
        val entity = request.toEntity()
        val savedEntity = serviceService.save(entity)
        return ServiceCreateResponseDTO.from(savedEntity)
    }

    @PatchMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    fun updateService(
        @PathVariable id: String,
        @RequestBody request: ServiceCreateRequestDTO,
    ): ResponseEntity<ServiceEntity> = try {
        val existing = serviceService.findByIdOrThrow(id)

        val mergedService = existing.copy(
            name = request.name ?: existing.name,
            description = request.description ?: existing.description,
            price = request.price ?: existing.price,
            type = request.type ?: existing.type,
            disabled = request.disabled ?: existing.disabled,
            duration = request.getDurationFromMinutes() ?: existing.duration,
            maxAvailable = request.maxAvailable ?: existing.maxAvailable,
            weekday = request.getWeekdayHours() ?: existing.weekday,
            image = request.image ?: existing.image
        )

        val savedService = serviceService.save(mergedService)
        ResponseEntity.ok(savedService)

    } catch (e: NoSuchElementException) {
        ResponseEntity.status(HttpStatus.NOT_FOUND).build()
    } catch (e: Exception) {
        ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build()
    }

    @DeleteMapping("/{id}")
    fun deleteServiceWithOption(
        @PathVariable id: String,
        @RequestParam(required = true) deleteOption: Int,
    ): ResponseEntity<String> =
        try {
            serviceService.deleteService(id, deleteOption)
            ResponseEntity.ok("Service deleted")
        } catch (e: IllegalArgumentException) {
            ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.message ?: "Invalid request")
        } catch (e: NoSuchElementException) {
            ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.message ?: "Service not found")
        } catch (e: Exception) {
            ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Server error")
        }
}
