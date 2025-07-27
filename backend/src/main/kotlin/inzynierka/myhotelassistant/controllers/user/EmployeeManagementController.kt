package inzynierka.myhotelassistant.controllers.user

import inzynierka.myhotelassistant.dto.ScheduleDTO
import inzynierka.myhotelassistant.exceptions.HttpException.InvalidArgumentException
import inzynierka.myhotelassistant.models.user.UserEntity
import inzynierka.myhotelassistant.services.EmployeeService
import inzynierka.myhotelassistant.services.ScheduleService
import jakarta.validation.Valid
import jakarta.validation.constraints.Email
import jakarta.validation.constraints.Pattern
import jakarta.validation.constraints.Size
import org.slf4j.LoggerFactory
import org.springframework.data.domain.PageRequest
import org.springframework.http.HttpStatus
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
import java.time.ZonedDateTime
import java.time.format.DateTimeParseException

@RestController
@RequestMapping("/management/employees")
class EmployeeManagementController(
    private val employeeService: EmployeeService,
    private val scheduleService: ScheduleService,
) {
    private val logger = LoggerFactory.getLogger(EmployeeManagementController::class.java)

    private val passwordMask = "**********"

    data class EmployeeDTO(
        @field:Pattern(
            regexp = "^[\\w-_]{3,20}$",
            message = "Username must be between 3 and 20 alphanumerical characters with '_' or '-'",
        )
        val username: String,
        @field:Size(min = 8, message = "Password must be at least 8 characters long")
        val password: String,
        @field:Email(message = "Email should be valid")
        val email: String,
        @field:Pattern(
            regexp = "^[A-Za-z-]{2,20}$",
            message = "Name must be 2-20 characters long and may include '-'",
        )
        val name: String,
        @field:Pattern(
            regexp = "^[A-Za-z-]{2,30}$",
            message = "Surname must be 2-30 characters long and may include '-'.",
        )
        val surname: String,
        @field:Pattern(
            regexp = "^(EMPLOYEE|RECEPTIONIST|MANAGER)$",
            flags = [Pattern.Flag.CASE_INSENSITIVE],
            message = "Role must be either EMPLOYEE, RECEPTIONIST or MANAGER",
        )
        val role: String? = null,
    )

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun addEmployee(
        @RequestBody @Valid employeeDTO: EmployeeDTO,
    ): UserEntity {
        val newEmployee = employeeService.createEmployee(employeeDTO)
        val savedEmployee = employeeService.addEmployee(newEmployee)
        savedEmployee.password = passwordMask
        logger.debug("Added new employee: ${savedEmployee.username}")
        return savedEmployee
    }

    @GetMapping("/username/{username}")
    @ResponseStatus(HttpStatus.OK)
    fun getEmployeeWithUsername(
        @PathVariable username: String,
    ): UserEntity {
        val employee = employeeService.findByUsernameOrThrow(username)
        employee.password = passwordMask
        logger.debug("Found employee: ${employee.username}")
        return employee
    }

    @GetMapping(value = ["/username/{username}/schedule"], params = ["date"])
    @ResponseStatus(HttpStatus.OK)
    fun getEmployeeWeekSchedule(
        @PathVariable username: String,
        @RequestParam date: String,
    ): List<ScheduleDTO> {
        try {
            val parsedDate = ZonedDateTime.parse(date).toLocalDate()
            return scheduleService.getEmployeeWeekScheduleByUsername(username, parsedDate)
        } catch (_: DateTimeParseException) {
            throw InvalidArgumentException("Invalid date format. Expected format is ISO_ZONED_DATE_TIME.")
        }
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    fun getEmployees(
        @RequestParam(defaultValue = "0") page: Int,
        @RequestParam(defaultValue = "10") size: Int,
    ): List<UserEntity> {
        val pageable = PageRequest.of(page, size)
        val employees = employeeService.getAllEmployees(pageable)
        employees.map { it.password = passwordMask }
        logger.debug("Found ${employees.size} employees at page $page")
        return employees
    }

    @DeleteMapping
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun removeEmployee(
        @RequestParam username: String,
    ) {
        employeeService.deleteEmployee(username)
        logger.debug("Removed employee: $username")
    }

    @PatchMapping("/role")
    @ResponseStatus(HttpStatus.OK)
    fun changeRole(
        @RequestParam username: String,
        @RequestParam role: String,
    ) {
        employeeService.changeRole(username, role)
        logger.debug("Changed role of employee: $username to $role")
    }
}
