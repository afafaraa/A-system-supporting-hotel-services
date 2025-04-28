package inzynierka.myhotelassistant.controllers.user

import inzynierka.myhotelassistant.models.UserEntity
import inzynierka.myhotelassistant.services.EmployeeService
import jakarta.validation.Valid
import jakarta.validation.constraints.Email
import jakarta.validation.constraints.Pattern
import jakarta.validation.constraints.Size
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PatchMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/management/employees")
class EmployeeController(
    private val employeeService: EmployeeService
) {

    private val logger = LoggerFactory.getLogger(EmployeeController::class.java)

    data class EmployeeDTO(
        @field:Pattern(
            regexp = "^[\\w-_]{3,20}$",
            message = "Username must be between 3 and 20 alphanumerical characters with '_' or '-'")
        val username: String,

        @field:Size(min = 8, message = "Password must be at least 8 characters long")
        val password: String,

        @field:Email(message = "Email should be valid")
        val email: String,

        @field:Pattern(
            regexp = "^[A-Za-z-]{2,20}$",
            message = "Name must be 2-20 characters long and may include '-'")
        val name: String,

        @field:Pattern(
            regexp = "^[A-Za-z-]{2,30}$",
            message = "Surname must be 2-30 characters long and may include '-'.")
        val surname: String,

        @field:Pattern(
            regexp = "^(EMPLOYEE|RECEPTIONIST|MANAGER)$", flags = [Pattern.Flag.CASE_INSENSITIVE],
            message = "Role must be either EMPLOYEE, RECEPTIONIST or MANAGER")
        val role: String? = null
    )

    @PostMapping
    fun addEmployee(@RequestBody @Valid employeeDTO: EmployeeDTO): ResponseEntity<UserEntity> {
        val newEmployee = employeeService.createEmployee(employeeDTO)
        val savedEmployee = employeeService.addEmployee(newEmployee)
        savedEmployee.password = "**********"
        logger.debug("Added new employee: ${savedEmployee.username}")
        return ResponseEntity.status(HttpStatus.CREATED).body(savedEmployee)
    }

    @GetMapping
    fun getEmployeeWithUsername(@RequestParam username: String): ResponseEntity<UserEntity> {
        val employee = employeeService.findByUsernameOrThrow(username)
        employee.password = "**********"
        logger.debug("Found employee: ${employee.username}")
        return ResponseEntity.ok().body(employee)
    }

    @DeleteMapping
    fun removeEmployee(@RequestParam username: String): ResponseEntity<Any> {
        employeeService.deleteEmployee(username)
        logger.debug("Removed employee: $username")
        return ResponseEntity.noContent().build()
    }

    @PatchMapping("/role")
    fun changeRole(@RequestParam username: String, @RequestParam role: String): ResponseEntity<Any> {
        employeeService.changeRole(username, role)
        logger.debug("Changed role of employee: $username to $role")
        return ResponseEntity.ok().build()
    }
}
