package inzynierka.myhotelassistant.services

import inzynierka.myhotelassistant.controllers.user.EmployeeController
import inzynierka.myhotelassistant.exceptions.HttpException.*
import inzynierka.myhotelassistant.models.Role
import inzynierka.myhotelassistant.models.UserEntity
import inzynierka.myhotelassistant.repositories.UserRepository
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import kotlin.jvm.Throws

@Service
class EmployeeService(val userRepository: UserRepository, private val passwordEncoder: PasswordEncoder) {

    @Throws(InvalidRoleNameException::class)
    fun createEmployee(employeeDTO: EmployeeController.EmployeeDTO): UserEntity {
        return UserEntity(
            username = employeeDTO.username,
            password = passwordEncoder.encode(employeeDTO.password),
            email = employeeDTO.email,
            name = employeeDTO.name.lowercase().replaceFirstChar { it.uppercase() },
            surname = employeeDTO.surname.lowercase().replaceFirstChar { it.uppercase() },
            role = Role.convertFromString(employeeDTO.role?.uppercase() ?: Role.EMPLOYEE.name)
        )
    }

    @Throws(UserAlreadyExistsException::class)
    fun addEmployee(employee: UserEntity): UserEntity   {
        if (userRepository.existsByUsername(employee.username))
            throw UserAlreadyExistsException("User with username \"${employee.username}\" already exists")
        return userRepository.save(employee)
    }

    @Throws(UserNotFoundException::class)
    fun findByUsernameOrThrow(username: String): UserEntity {
        return userRepository.findByUsername(username)
            ?: throw UserNotFoundException("User with username \"$username\" was not found")
    }

    @Transactional
    @Throws(UserNotFoundException::class)
    fun deleteEmployee(username: String) {
        // TODO: implement checking for active services for this employee
        val foundUser = findByUsernameOrThrow(username)
        userRepository.delete(foundUser)
    }

    @Transactional
    @Throws(UserNotFoundException::class, InvalidRoleNameException::class)
    fun changeRole(username: String, role: String) {
        val newRole = Role.convertFromString(role)
        if (newRole == Role.GUEST) throw InvalidRoleNameException("Cannot assign GUEST role to an employee")
        if (newRole == Role.ADMIN) throw InvalidRoleNameException("Cannot assign ADMIN role to an employee")
        val user = findByUsernameOrThrow(username)
        val oldRole = user.role
        if (oldRole == newRole) throw InvalidRoleNameException("User already has this role")
        user.role = newRole
        userRepository.save(user)
    }
}