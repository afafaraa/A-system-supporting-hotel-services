package inzynierka.myhotelassistant.controllers.management

import inzynierka.myhotelassistant.models.management.IssueStatus
import inzynierka.myhotelassistant.services.management.MaintenanceService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.time.LocalDateTime

@RestController
@RequestMapping("/maintenance")
class MaintenanceController(
    private val service: MaintenanceService,
) {
    data class IssueRequest(
        val title: String,
        val description: String,
        val roomNumber: String,
        val reportedBy: String,
    )

    data class IssueResponse(
        val id: String,
        val title: String,
        val description: String?,
        val roomNumber: String?,
        val status: String,
        val reportedBy: String,
        val assignedTo: String?,
        val reportedDate: LocalDateTime,
    )

    @GetMapping
    fun getAllIssues(): List<IssueResponse> = service.getAllIssues()

    @GetMapping("/{id}")
    fun getIssue(
        @PathVariable id: String,
    ): IssueResponse = service.getIssue(id)

    @PostMapping
    fun createIssue(
        @RequestBody request: IssueRequest,
    ): IssueResponse = service.createIssue(request)

    @DeleteMapping("/{id}")
    fun deleteIssue(
        @PathVariable id: String,
    ) = ResponseEntity.ok(service.deleteIssue(id))

    @GetMapping("/status/{status}")
    fun getByStatus(
        @PathVariable status: IssueStatus,
    ): List<IssueResponse> = service.getIssueByStatus(status)

    @GetMapping("/employee/{employeeId}")
    fun getEmployeeIssues(
        @PathVariable employeeId: String,
    ): List<IssueResponse> = service.getEmployeeIssues(employeeId)

    @GetMapping("/employee/{employeeId}/in-progress")
    fun getEmployeeIssuesInProgress(
        @PathVariable employeeId: String,
    ): List<IssueResponse> = service.getEmployeeInProgressIssues(employeeId)

    @PutMapping("/{id}")
    fun updateIssue(
        @PathVariable id: String,
        @RequestBody request: IssueRequest,
    ): IssueResponse = service.updateIssue(id, request)

    @PutMapping("/{id}/assign/{employeeId}")
    fun assignIssue(
        @PathVariable id: String,
        @PathVariable employeeId: String,
    ): IssueResponse = service.assignIssue(id, employeeId)

    @PutMapping("/{id}/status/{status}")
    fun changeStatus(
        @PathVariable id: String,
        @PathVariable status: IssueStatus,
    ): IssueResponse = service.changeIssueStatus(id, status)
}
