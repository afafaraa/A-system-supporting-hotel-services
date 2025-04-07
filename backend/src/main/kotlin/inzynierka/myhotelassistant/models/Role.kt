package inzynierka.myhotelassistant.models

import inzynierka.myhotelassistant.exceptions.HttpException.InvalidRoleNameException

enum class Role {
    GUEST,
    EMPLOYEE,
    RECEPTIONIST,
    MANAGER,
    ADMIN;

    companion object {
        fun convertFromString(role: String): Role {
            try { return Role.valueOf(role) }
            catch (e: IllegalArgumentException) { throw InvalidRoleNameException(e.message!!) }
        }
    }
}