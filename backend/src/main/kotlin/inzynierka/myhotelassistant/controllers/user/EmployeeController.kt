package inzynierka.myhotelassistant.controllers.user

import inzynierka.myhotelassistant.services.EmployeeService
import jakarta.validation.Valid
import jakarta.validation.constraints.*
import jakarta.validation.constraints.Pattern.Flag
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/management/employees")
class EmployeeController(private val employeeService: EmployeeService) {

    data class EmployeeDTO(
        @field:Pattern(regexp = "^[\\w-_]{3,20}$", message = "Username must be between 3 and 20 alphanumerical characters with '_' or '-'")
        val username: String,

        @field:Size(min = 8, message = "Password must be at least 8 characters long")
        val password: String,

        @field:Email(message = "Email should be valid")
        val email: String,

        @field:Pattern(regexp = "^[A-Z][a-z-]{1,19}$", message = "Name must start with a capital letter and be followed by lowercase letters with max 20 characters")
        val name: String,

        @field:Pattern(regexp = "^[A-Z][a-z-]{1,29}$", message = "Surname must start with a capital letter and be followed by lowercase letters with max 30 characters")
        val surname: String,

        @field:Pattern(regexp = "^(EMPLOYEE|RECEPTIONIST|MANAGER)$", flags = [Flag.CASE_INSENSITIVE], message = "Role must be either EMPLOYEE, RECEPTIONIST or MANAGER")
        val role: String? = null
    )

    data class MessageResponse(
        val message: String,
        val data: Any? = null
    )

    @PostMapping
    fun addEmployee(@RequestBody @Valid employeeDTO: EmployeeDTO): ResponseEntity<MessageResponse> {
        val newEmployee = employeeService.createEmployee(employeeDTO)
        val savedEmployee = employeeService.addEmployee(newEmployee)
        savedEmployee.password = "**********"
        return ResponseEntity.status(HttpStatus.CREATED).body(
            MessageResponse(
                message = "User with username \"${savedEmployee.username}\" has been successfully created",
                data = savedEmployee
            )
        )
    }

    @GetMapping
    fun getEmployeeWithUsername(@RequestParam username: String): ResponseEntity<MessageResponse> {
        val employee = employeeService.findByUsernameOrThrow(username)
        employee.password = "**********"
        return ResponseEntity.ok().body(
            MessageResponse(
                message = "User with username \"$username\" has been successfully retrieved",
                data = employee
            )
        )
    }

    @DeleteMapping
    fun removeEmployee(@RequestParam username: String): ResponseEntity<MessageResponse> {
        employeeService.deleteEmployee(username)
        return ResponseEntity.ok().body(MessageResponse("User with username \"$username\" has been successfully removed"))
    }

    @PatchMapping("/role")
    fun changeRole(@RequestParam username: String, @RequestParam role: String): ResponseEntity<MessageResponse> {
        val (previousRole, newRole) = employeeService.changeRole(username, role)
        val process = if (newRole.permissionLevel > previousRole.permissionLevel) "promoted" else "demoted"
        return ResponseEntity.ok().body(
            MessageResponse(
                message = "User with username \"$username\" has been successfully $process from role \"$previousRole\" to role \"$newRole\"",
            )
        )
    }
}