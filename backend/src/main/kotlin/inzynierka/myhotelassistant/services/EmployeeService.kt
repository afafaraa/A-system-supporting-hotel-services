package inzynierka.myhotelassistant.services

import inzynierka.myhotelassistant.controllers.user.EmployeeController
import inzynierka.myhotelassistant.exceptions.HttpException.InvalidRoleNameException
import inzynierka.myhotelassistant.exceptions.HttpException.UserAlreadyExistsException
import inzynierka.myhotelassistant.exceptions.HttpException.UserNotFoundException
import inzynierka.myhotelassistant.models.user.Role
import inzynierka.myhotelassistant.models.user.UserEntity
import inzynierka.myhotelassistant.repositories.UserRepository
import org.springframework.data.domain.Pageable
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import kotlin.jvm.Throws

@Service
class EmployeeService(
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder,
) {
    private val employeeRoles = listOf(Role.EMPLOYEE, Role.RECEPTIONIST, Role.MANAGER)

    fun findById(id: String): UserEntity? {
        val opt = userRepository.findById(id)
        val user = opt.get()
        if(user.role == Role.EMPLOYEE) {
            return user
        }
        return null
    }

    fun getAllEmployees(pageable: Pageable): List<UserEntity> = userRepository.findByRoleIn(employeeRoles, pageable).content

    @Throws(InvalidRoleNameException::class)
    fun createEmployee(employeeDTO: EmployeeController.EmployeeDTO): UserEntity =
        UserEntity(
            username = employeeDTO.username,
            password = passwordEncoder.encode(employeeDTO.password),
            email = employeeDTO.email,
            name = employeeDTO.name.lowercase().replaceFirstChar { it.uppercase() },
            surname = employeeDTO.surname.lowercase().replaceFirstChar { it.uppercase() },
            role = employeeDTO.role?.let { Role.convertFromString(it.uppercase()) } ?: Role.EMPLOYEE,
        )

    @Throws(UserAlreadyExistsException::class)
    fun addEmployee(employee: UserEntity): UserEntity {
        if (userRepository.existsByUsername(employee.username)) {
            throw UserAlreadyExistsException("User with username '${employee.username}' already exists")
        }
        return userRepository.save(employee)
    }

    @Throws(UserNotFoundException::class)
    fun findByUsernameOrThrow(username: String): UserEntity =
        userRepository.findByUsername(username)
            ?: throw UserNotFoundException("User with username '$username' was not found")

    @Transactional
    @Throws(UserNotFoundException::class)
    fun deleteEmployee(username: String) {
        // TODO: implement checking for active services for this employee
        val foundUser = findByUsernameOrThrow(username)
        userRepository.delete(foundUser)
    }

    @Transactional
    @Throws(UserNotFoundException::class, InvalidRoleNameException::class)
    fun changeRole(
        username: String,
        role: String,
    ) {
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
