package inzynierka.myhotelassistant.repositories.management

import inzynierka.myhotelassistant.models.management.IssueEntity
import inzynierka.myhotelassistant.models.management.IssueStatus
import inzynierka.myhotelassistant.models.user.UserEntity
import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.stereotype.Repository
import java.util.*

@Repository
interface IssueRepository: MongoRepository<IssueEntity, String> {
    fun findByStatus(status: IssueStatus): List<IssueEntity>
    fun findByAssignedTo(assignedTo: String): List<IssueEntity>
    fun findByAssignedToAndStatusOrderByReportedDateDesc(assignedTo: String, status: IssueStatus): List<IssueEntity>

}