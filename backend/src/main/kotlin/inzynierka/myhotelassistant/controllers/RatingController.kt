package inzynierka.myhotelassistant.controllers

import com.fasterxml.jackson.annotation.JsonUnwrapped
import inzynierka.myhotelassistant.models.service.Rating
import inzynierka.myhotelassistant.models.service.RatingEntity
import inzynierka.myhotelassistant.repositories.RatingRepository
import inzynierka.myhotelassistant.repositories.ServiceRepository
import inzynierka.myhotelassistant.services.EmployeeService
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.security.Principal

@RestController
@RequestMapping("/ratings")
class RatingController(
    private val employeeService: EmployeeService,
    private val ratingRepository: RatingRepository,
    private val serviceRepository: ServiceRepository,
) {
    data class RatingWithServiceName(
        @field:JsonUnwrapped
        val rating: Rating,
        val serviceName: String?,
        val serviceThumbnailUrl: String? = null,
    ) {
        companion object {
            fun fromEntity(
                entity: RatingEntity,
                serviceName: String?,
                serviceThumbnailUrl: String? = null,
            ): RatingWithServiceName =
                RatingWithServiceName(
                    rating = Rating.fromEntity(entity),
                    serviceName = serviceName,
                    serviceThumbnailUrl = serviceThumbnailUrl,
                )
        }
    }

    @GetMapping("/my-ratings")
    fun getEmployeeRating(principal: Principal): List<RatingWithServiceName> {
        val employee = employeeService.findByUsernameOrThrow(principal.name)
        return ratingRepository
            .findAllByEmployeeId(employee.id!!)
            .map { rating ->
                val serviceDetails = serviceRepository.findServiceDetailsById(rating.serviceId)
                RatingWithServiceName.fromEntity(
                    entity = rating,
                    serviceName = serviceDetails?.name,
                    serviceThumbnailUrl = serviceDetails?.image,
                )
            }
    }
}
