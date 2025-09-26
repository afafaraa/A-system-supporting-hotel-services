package inzynierka.myhotelassistant.models.user

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
    var name: String,
    var surname: String,
    var guestData: GuestData? = null,
    var employeeData: EmployeeData? = null,
)
