package inzynierka.myhotelassistant.services.management

import inzynierka.myhotelassistant.controllers.management.MaintenanceController
import inzynierka.myhotelassistant.models.management.IssueEntity
import inzynierka.myhotelassistant.models.management.IssueStatus
import inzynierka.myhotelassistant.repositories.UserRepository
import inzynierka.myhotelassistant.repositories.management.IssueRepository
import org.springframework.stereotype.Service

@Service
class MaintenanceService(
    private val issueRepository: IssueRepository,
    private val userRepository: UserRepository,
) {
    fun getAllIssues(): List<MaintenanceController.IssueResponse> =
        issueRepository.findAll().map { it.toResponse() }

    fun createIssue(request: MaintenanceController.IssueRequest): MaintenanceController.IssueResponse {

        val issue = IssueEntity(
            title = request.title,
            description = request.description,
            location = request.roomNumber,
            status = IssueStatus.OPEN,
            reportedBy = request.reportedById,
            assignedTo = null,
        )
        return issueRepository.save(issue).toResponse()
    }

    fun getIssue(id: String): MaintenanceController.IssueResponse =
        issueRepository.findById(id)
            .orElseThrow { IllegalArgumentException("User $id does not exist") }
            .toResponse()

    fun getIssueByStatus(status: IssueStatus): List<MaintenanceController.IssueResponse> =
        issueRepository.findByStatus(status).map { it.toResponse() }

    fun getEmployeeIssues(employeeId: String): List<MaintenanceController.IssueResponse> =
        issueRepository.findByAssignedTo(employeeId).map { it.toResponse() }

    fun getEmployeeInProgressIssues(employeeId: String): List<MaintenanceController.IssueResponse> =
        issueRepository.findByAssignedToAndStatusOrderByReportedDateDesc(
            assignedTo = employeeId,
            status = IssueStatus.IN_PROGRESS
        ).map { it.toResponse() }

    fun updateIssue(id: String, request: MaintenanceController.IssueRequest): MaintenanceController.IssueResponse {
        val existing = issueRepository.findById(id)
            .orElseThrow { NoSuchElementException("User $id does not exist") }

        val updated = existing.copy(
            title = request.title,
            description = request.description,
            location = request.roomNumber,
            reportedBy = request.reportedById,
        )

        return issueRepository.save(updated).toResponse()
    }

    fun assignIssue(id: String, assignedToId: String): MaintenanceController.IssueResponse {
        val issue = issueRepository.findById(id)
            .orElseThrow { NoSuchElementException("Issue $id does not exist") }

        val user = userRepository.findById(assignedToId)
            .orElseThrow { IllegalArgumentException("User $assignedToId does not exist") }

        val updated = issue.copy(
            assignedTo = user.id,
            status = IssueStatus.IN_PROGRESS,
        )
        return issueRepository.save(updated).toResponse()
    }

    fun changeIssueStatus(id: String, newStatus: IssueStatus): MaintenanceController.IssueResponse {
        val issue = issueRepository.findById(id)
            .orElseThrow { IllegalArgumentException("User $id does not exist") }

        val updated = issue.copy(status = newStatus)
        return issueRepository.save(updated).toResponse()
    }

    fun deleteIssue(id: String) {
        if (issueRepository.existsById(id)) {
            issueRepository.deleteById(id)
        } else throw NoSuchElementException("Issue $id does not exist")
    }

    private fun IssueEntity.toResponse(): MaintenanceController.IssueResponse {
        val reporter = reportedBy?.let { userRepository.findById(it).orElse(null) }
        val assignee = assignedTo?.let { userRepository.findById(it).orElse(null) }

        return MaintenanceController.IssueResponse(
        id = id!!,
        title = title,
        description = description,
        roomNumber = location,
        status = status.displayName,
        assignedTo =  assignee?.let { "${it.name} ${it.surname}" },
        reportedBy = "${reporter?.name} ${reporter?.surname}",
        )
    }
}