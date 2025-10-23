package inzynierka.myhotelassistant.services.management

import inzynierka.myhotelassistant.controllers.management.MaintenanceController
import inzynierka.myhotelassistant.exceptions.HttpException.EntityNotFoundException
import inzynierka.myhotelassistant.models.management.IssueEntity
import inzynierka.myhotelassistant.models.management.IssueStatus
import inzynierka.myhotelassistant.repositories.UserRepository
import inzynierka.myhotelassistant.repositories.management.IssueRepository
import org.springframework.stereotype.Service
import kotlin.NoSuchElementException
import kotlin.jvm.Throws

@Service
class MaintenanceService(
    private val issueRepository: IssueRepository,
    private val userRepository: UserRepository,
) {
    fun getAllIssues(): List<MaintenanceController.IssueResponse> = issueRepository.findAll().map { it.toResponse() }

    fun createIssue(request: MaintenanceController.IssueRequest): MaintenanceController.IssueResponse {
        val issue =
            IssueEntity(
                title = request.title,
                description = request.description,
                location = request.roomNumber,
                status = IssueStatus.OPEN,
                reportedBy = request.reportedBy,
                assignedTo = null,
            )
        return issueRepository.save(issue).toResponse()
    }

    fun getIssue(id: String): MaintenanceController.IssueResponse =
        findByIdOrThrow(id)
            .toResponse()

    fun getIssueByStatus(status: IssueStatus): List<MaintenanceController.IssueResponse> =
        issueRepository.findByStatus(status).map { it.toResponse() }

    fun getEmployeeIssues(employee: String): List<MaintenanceController.IssueResponse> =
        issueRepository.findByAssignedTo(employee).map { it.toResponse() }

    fun getEmployeeInProgressIssues(employee: String): List<MaintenanceController.IssueResponse> =
        issueRepository
            .findByAssignedToAndStatusOrderByReportedDateDesc(
                assignedTo = employee,
                status = IssueStatus.IN_PROGRESS,
            ).map { it.toResponse() }

    fun updateIssue(
        id: String,
        request: MaintenanceController.IssueRequest,
    ): MaintenanceController.IssueResponse {
        val existing = findByIdOrThrow(id)

        val updated =
            existing.copy(
                title = request.title,
                description = request.description,
                location = request.roomNumber,
                reportedBy = request.reportedBy,
            )

        return issueRepository.save(updated).toResponse()
    }

    fun assignIssue(
        id: String,
        assignedTo: String,
    ): MaintenanceController.IssueResponse {
        val issue = findByIdOrThrow(id)

        require(userRepository.existsByUsername(assignedTo)) {
            "Employee with username '$assignedTo' was not found"
        }

        val updated =
            issue.copy(
                assignedTo = assignedTo,
                status = IssueStatus.IN_PROGRESS,
            )
        return issueRepository.save(updated).toResponse()
    }

    fun changeIssueStatus(
        id: String,
        newStatus: IssueStatus,
    ): MaintenanceController.IssueResponse {
        val issue = findByIdOrThrow(id)

        val updated = issue.copy(status = newStatus)
        return issueRepository.save(updated).toResponse()
    }

    fun deleteIssue(id: String) {
        if (issueRepository.existsById(id)) {
            issueRepository.deleteById(id)
        } else {
            throw NoSuchElementException("Issue $id does not exist")
        }
    }

    @Throws(EntityNotFoundException::class)
    fun findByIdOrThrow(id: String): IssueEntity =
        issueRepository
            .findById(id)
            .orElseThrow { EntityNotFoundException("Issue $id does not exist") }

    private fun IssueEntity.toResponse(): MaintenanceController.IssueResponse {
        val reporter = reportedBy?.let { userRepository.findByUsername(it) }
        val assignee = assignedTo?.let { userRepository.findByUsername(it) }

        return MaintenanceController.IssueResponse(
            id = id!!,
            title = title,
            description = description,
            roomNumber = location,
            status = status.toString(),
            assignedTo = "${assignee?.name} ${assignee?.surname}",
            reportedBy = "${reporter?.name} ${reporter?.surname}",
            reportedDate = reportedDate,
        )
    }
}
