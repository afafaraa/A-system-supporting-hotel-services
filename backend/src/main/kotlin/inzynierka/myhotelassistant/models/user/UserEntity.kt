package inzynierka.myhotelassistant.models.user

import inzynierka.myhotelassistant.models.notification.NotificationEntity
import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.index.Indexed
import org.springframework.data.mongodb.core.mapping.Document

@Document(collection = "users")
data class UserEntity(
    @Id val id: String? = null,
    var role: Role = Role.GUEST,
    @Indexed
    var email: String,
    @Indexed(unique = true)
    var username: String,
    var password: String,
    val name: String,
    val surname: String,
    val guestData: GuestData? = null,
    val employeeData: EmployeeData? = null,
    val notifications: MutableList<NotificationEntity> = mutableListOf(),
)
