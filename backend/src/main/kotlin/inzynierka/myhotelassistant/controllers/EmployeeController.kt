package inzynierka.myhotelassistant.controllers

import inzynierka.myhotelassistant.services.EmployeeService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/management/employees")
class EmployeeController(private val employeeService: EmployeeService) {

    data class EmployeeDTO(
        val username: String,
        val password: String,
        val email: String,
        val name: String,
        val surname: String,
        val roles: Set<String>? = null
    )

    data class MessageResponse(
        val message: String,
        val data: Any? = null
    )

    @PostMapping
    fun addEmployee(@RequestBody employeeDTO: EmployeeDTO): ResponseEntity<MessageResponse> {
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

    @DeleteMapping
    fun removeEmployee(@RequestParam username: String): ResponseEntity<MessageResponse> {
        employeeService.deleteEmployee(username)
        return ResponseEntity.ok().body(MessageResponse("User with username \"$username\" has been successfully removed"))
    }

    @PatchMapping("/role/grant")
    fun grantRole(@RequestParam username: String, @RequestParam role: String): ResponseEntity<MessageResponse> {
        val allRoles = employeeService.grantRole(username, role)
        return ResponseEntity.ok().body(
            MessageResponse(
                message = "User with username \"$username\" has been successfully granted with role \"$role\"",
                data = allRoles
            )
        )
    }

    @PatchMapping("/role/revoke")
    fun revokeRole(@RequestParam username: String, @RequestParam role: String): ResponseEntity<MessageResponse> {
        val allRoles = employeeService.revokeRole(username, role)
        return ResponseEntity.ok().body(
            MessageResponse(
                message = "User with username \"$username\" has been revoked with role \"$role\"",
                data = allRoles
            )
        )
    }
}