package inzynierka.myhotelassistant.models

import inzynierka.myhotelassistant.exceptions.HttpException.InvalidRoleNameException

enum class Role(val permissionLevel: Int) {
    GUEST(0),
    EMPLOYEE(1),
    RECEPTIONIST(2),
    MANAGER(3),
    ADMIN(4);

    companion object {
        fun convertFromString(role: String): Role {
            try { return Role.valueOf(role) }
            catch (e: IllegalArgumentException) { throw InvalidRoleNameException(e.message ?: "Invalid role name") }
        }
    }
}