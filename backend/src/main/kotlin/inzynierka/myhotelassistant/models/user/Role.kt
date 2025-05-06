package inzynierka.myhotelassistant.models.user

import inzynierka.myhotelassistant.exceptions.HttpException

enum class Role {
    GUEST,
    EMPLOYEE,
    RECEPTIONIST,
    MANAGER,
    ADMIN,
    ;

    companion object {
        fun convertFromString(role: String): Role {
            try {
                return valueOf(role)
            } catch (
                e: IllegalArgumentException,
            ) {
                throw HttpException.InvalidRoleNameException(e.message ?: "Invalid role name")
            }
        }
    }
}
