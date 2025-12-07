package inzynierka.myhotelassistant.controllers.services

import inzynierka.myhotelassistant.dto.ServiceCreateRequestDTO
import inzynierka.myhotelassistant.dto.ServiceCreateResponseDTO
import inzynierka.myhotelassistant.models.service.RatingEntity
import inzynierka.myhotelassistant.models.service.ServiceEntity
import inzynierka.myhotelassistant.models.service.ServiceTypeAttributes
import inzynierka.myhotelassistant.repositories.RatingRepository
import inzynierka.myhotelassistant.services.ScheduleService
import inzynierka.myhotelassistant.services.ServiceService
import inzynierka.myhotelassistant.services.UserService
import inzynierka.myhotelassistant.utils.NotificationGenerator
import org.springframework.data.domain.PageRequest
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PatchMapping
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
    private val ratingRepository: RatingRepository,
    private val notifsGenerator: NotificationGenerator,
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
        return entities.map { ServiceCreateResponseDTO.from(it, ratingRepository.findAllByServiceId(it.id!!)) }
    }

    @GetMapping("/one/{id}")
    @ResponseStatus(HttpStatus.OK)
    fun getServiceById(
        @PathVariable id: String,
    ) = ServiceCreateResponseDTO.from(serviceService.findByIdOrThrow(id), ratingRepository.findAllByServiceId(id))

    @PostMapping("/rate")
    @ResponseStatus(HttpStatus.OK)
    fun rateService(
        @RequestBody req: RateServiceRequestBody,
    ) {
        val guest = userService.findByUsernameOrThrow(req.username)
        val schedule = scheduleService.findByIdOrThrow(req.scheduleId)
        val rating =
            RatingEntity(
                serviceId = schedule.serviceId,
                scheduleId = req.scheduleId,
                employeeId = schedule.employeeId,
                guestId = guest.id!!,
                fullName = guest.name + " " + guest.surname,
                rating = req.rating,
                comment = req.comment,
            )
        notifsGenerator.pushNotificationToUser(
            userId = schedule.employeeId,
            content = NotificationGenerator.Content.EMPLOYEE_NEW_REVIEW_RECEIVED,
            args = arrayOf(rating.fullName, rating.rating),
        )
        ratingRepository.save(rating)
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun createService(
        @RequestBody request: ServiceCreateRequestDTO,
    ): ServiceCreateResponseDTO {
        val entity = request.toEntity()
        val savedEntity = serviceService.save(entity)
        return ServiceCreateResponseDTO.from(savedEntity, emptyList())
    }

    @GetMapping("/{serviceId}/attributes")
    @ResponseStatus(HttpStatus.OK)
    fun getServiceAttributes(
        @PathVariable serviceId: String,
    ) = serviceService.getServiceAttributes(serviceId)

    @PatchMapping("/{serviceId}/attributes")
    fun updateServiceAttributes(
        @PathVariable serviceId: String,
        @RequestBody attributes: ServiceTypeAttributes,
    ): ServiceEntity {
        serviceService.updateServiceAttributes(serviceId, attributes)
        val service = serviceService.findByIdOrThrow(serviceId)
        service.attributes = attributes
        return serviceService.save(service)
    }

    @PatchMapping("/{id}")
    fun updateService(
        @PathVariable id: String,
        @RequestBody request: ServiceCreateRequestDTO,
    ): ServiceCreateResponseDTO {
        val updated = serviceService.update(id, request)
        return ServiceCreateResponseDTO.from(updated, ratingRepository.findAllByServiceId(id))
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
        } catch (_: Exception) {
            ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Server error")
        }
}
