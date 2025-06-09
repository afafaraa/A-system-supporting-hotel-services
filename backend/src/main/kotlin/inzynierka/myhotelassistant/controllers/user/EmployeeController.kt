package inzynierka.myhotelassistant.controllers.user

import inzynierka.myhotelassistant.dto.ScheduleData
import inzynierka.myhotelassistant.exceptions.HttpException.InvalidArgumentException
import inzynierka.myhotelassistant.services.EmployeeService
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestHeader
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController
import java.time.ZonedDateTime
import java.time.format.DateTimeParseException

@RestController
@RequestMapping("/employee")
class EmployeeController(
    private val employeeService: EmployeeService,
) {
    @GetMapping("/week-schedule")
    @ResponseStatus(HttpStatus.OK)
    fun getAssignedSchedules(
        @RequestParam date: String,
        @RequestHeader("Authorization") authHeader: String,
    ): ScheduleData {
        try {
            val parsedDate = ZonedDateTime.parse(date).toLocalDate()
            return employeeService.findAllAssignedSchedules(parsedDate, authHeader)
        } catch (_: DateTimeParseException) {
            throw InvalidArgumentException("Invalid date format. Expected format is ISO_ZONED_DATE_TIME.")
        }
    }
}
