package inzynierka.myhotelassistant.controllers.management

import inzynierka.myhotelassistant.models.management.IssueStatus
import inzynierka.myhotelassistant.services.management.MaintenanceService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/maintenance")
class MaintenanceController(
    private val service: MaintenanceService,
) {
    data class IssueRequest(
        val title: String,
        val description: String,
        val roomNumber: String,
        val reportedById: String,
    )

    data class IssueResponse(
        val id: String,
        val title: String,
        val description: String?,
        val roomNumber: String?,
        val status: String,
        val reportedBy: String,
        val assignedTo: String?,
    )

    data class AssignIssueRequest(
        val assignedToId: String
    )

    data class ChangeStatusRequest(
        val status: IssueStatus
    )

    @GetMapping
    fun getAllIssues(): ResponseEntity<List<IssueResponse>> = ResponseEntity.ok(service.getAllIssues())

    @GetMapping("/{id}")
    fun getIssue(@PathVariable id: String): ResponseEntity<IssueResponse> = ResponseEntity.ok(service.getIssue(id))

    @PostMapping
    fun createIssue(@RequestBody request: IssueRequest): ResponseEntity<IssueResponse> = ResponseEntity.ok(service.createIssue(request))

    @DeleteMapping("/{id}")
    fun deleteIssue(@PathVariable id: String) = ResponseEntity.ok(service.deleteIssue(id))

    @GetMapping("/status/{status}")
    fun getByStatus(@PathVariable status: IssueStatus): ResponseEntity<List<IssueResponse>> = ResponseEntity.ok(service.getIssueByStatus(status))

    @GetMapping("/employee/{employeeId}")
    fun getEmployeeIssues(@PathVariable employeeId: String): ResponseEntity<List<IssueResponse>> = ResponseEntity.ok(service.getEmployeeIssues(employeeId))

    @GetMapping("/employee/{employeeId}/in-progress")
    fun getEmployeeIssuesInProgress(@PathVariable employeeId: String): ResponseEntity<List<IssueResponse>> = ResponseEntity.ok(service.getEmployeeInProgressIssues(employeeId))

    @PutMapping("/{id}")
    fun updateIssue(@PathVariable id: String, @RequestBody request: IssueRequest): ResponseEntity<IssueResponse> = ResponseEntity.ok(service.updateIssue(id, request))

    @PutMapping("/{id}/assign")
    fun assignIssue(@PathVariable id: String, @RequestBody request: AssignIssueRequest): ResponseEntity<IssueResponse> = ResponseEntity.ok(service.assignIssue(id, request.assignedToId))

    @PutMapping("/{id}/status")
    fun changeStatus(@PathVariable id: String, @RequestBody newStatus: ChangeStatusRequest): ResponseEntity<IssueResponse> = ResponseEntity.ok(service.changeIssueStatus(id, newStatus.status))
}