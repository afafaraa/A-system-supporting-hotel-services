package inzynierka.myhotelassistant.models.management

import inzynierka.myhotelassistant.models.user.UserEntity
import org.springframework.data.mongodb.core.mapping.Document
import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.DBRef
import java.time.LocalDateTime

@Document(collection = "issues")
data class IssueEntity(
    @Id val id: String? = null,
    var title: String,
    var description: String,
    var location: String,
    var status: IssueStatus = IssueStatus.OPEN,
    var assignedTo: String? = null,
    var reportedBy: String? = null,
    var reportedDate: LocalDateTime = LocalDateTime.now(),
    var resolvedDate: LocalDateTime? = null
)