package inzynierka.myhotelassistant.services

import inzynierka.myhotelassistant.controllers.EmployeeController
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
            name = employeeDTO.name,
            surname = employeeDTO.surname,
            roles = employeeDTO.roles.orEmpty().map { Role.convertFromString(it) }.toMutableSet().apply { add(Role.EMPLOYEE) }
        )
    }

    @Throws(UserAlreadyExistsException::class)
    fun addEmployee(employee: UserEntity): UserEntity   {
        if (userRepository.existsByUsername(employee.username))
            throw UserAlreadyExistsException("User with username \"${employee.username}\" already exists")
        return userRepository.save(employee)
    }

    @Transactional
    @Throws(UserNotFoundException::class)
    fun deleteEmployee(username: String) {
        // TODO: implement checking for active services for this employee
        val foundUser = userRepository.findByUsername(username)
            ?: throw UserNotFoundException("User with username \"$username\" was not found")
        userRepository.delete(foundUser)
    }

    @Transactional
    @Throws(UserNotFoundException::class, InvalidRoleNameException::class)
    fun grantRole(username: String, role: String): Set<Role> {
        val enumRole = Role.convertFromString(role)
        val user = userRepository.findByUsername(username) ?: throw UserNotFoundException("User with username \"$username\" not found")
        if (user.roles.add(enumRole)) userRepository.save(user)
        return user.roles
    }

    @Transactional
    @Throws(UserNotFoundException::class, InvalidRoleNameException::class)
    fun revokeRole(username: String, role: String): Set<Role> {
        val enumRole = Role.convertFromString(role)
        val user = userRepository.findByUsername(username) ?: throw UserNotFoundException("User with username \"$username\" not found")
        if (user.roles.remove(enumRole)) userRepository.save(user)
        return user.roles
    }
}