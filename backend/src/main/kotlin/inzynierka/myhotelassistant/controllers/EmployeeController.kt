package inzynierka.myhotelassistant.controllers

import inzynierka.myhotelassistant.services.EmployeeService
import jakarta.validation.Valid
import jakarta.validation.constraints.*
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/management/employees")
class EmployeeController(private val employeeService: EmployeeService) {

    data class EmployeeDTO(
        @field:Size(min = 3, max = 20, message = "Username must be between 3 and 20 characters")
        val username: String,

        @field:Size(min = 8, message = "Password must be at least 8 characters long")
        val password: String,

        @field:Email(message = "Email should be valid")
        val email: String,

        @field:NotBlank(message = "Name is required")
        @field:Size(max = 20, message = "Name cannot be longer than 20 characters")
        val name: String,

        @field:NotBlank(message = "Surname is required")
        @field:Size(max = 30, message = "Surname cannot be longer than 30 characters")
        val surname: String,

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