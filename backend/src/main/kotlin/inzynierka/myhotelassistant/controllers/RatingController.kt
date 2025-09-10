package inzynierka.myhotelassistant.controllers

import inzynierka.myhotelassistant.models.service.RatingEntity
import inzynierka.myhotelassistant.repositories.RatingRepository
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
) {
    @GetMapping("/my-ratings")
    fun getEmployeeRating(principal: Principal): List<RatingEntity> {
        val employee = employeeService.findByUsernameOrThrow(principal.name)
        return ratingRepository.findAllByEmployeeId(employee.id!!)
    }
}
