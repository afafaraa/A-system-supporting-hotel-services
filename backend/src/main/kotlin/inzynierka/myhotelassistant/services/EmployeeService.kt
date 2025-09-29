package inzynierka.myhotelassistant.services

import inzynierka.myhotelassistant.controllers.user.EmployeeManagementController
import inzynierka.myhotelassistant.exceptions.HttpException.EntityNotFoundException
import inzynierka.myhotelassistant.exceptions.HttpException.InvalidRoleNameException
import inzynierka.myhotelassistant.exceptions.HttpException.UserAlreadyExistsException
import inzynierka.myhotelassistant.models.user.EmployeeData
import inzynierka.myhotelassistant.models.user.Role
import inzynierka.myhotelassistant.models.user.Role.Companion.employeeRoles
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
    fun findByIdOrThrow(id: String): UserEntity {
        val user =
            userRepository
                .findById(id)
                .orElseThrow { EntityNotFoundException("Employee with id '$id' was not found") }
        if (user.role !in Role.employeeRoles) {
            throw EntityNotFoundException("User with id '$id' is not an employee")
        }
        return user
    }

    fun getAllEmployees(pageable: Pageable): List<UserEntity> = userRepository.findByRoleIn(employeeRoles, pageable).content

    @Throws(InvalidRoleNameException::class)
    fun createEmployee(employeeDTO: EmployeeManagementController.EmployeeDTO): UserEntity =
        UserEntity(
            username = employeeDTO.username,
            password = passwordEncoder.encode(employeeDTO.password),
            email = employeeDTO.email,
            name = employeeDTO.name.lowercase().replaceFirstChar { it.uppercase() },
            surname = employeeDTO.surname.lowercase().replaceFirstChar { it.uppercase() },
            role = employeeDTO.role?.let { Role.convertFromString(it.uppercase()) } ?: Role.EMPLOYEE,
            employeeData = employeeDTO.employeeData,
        )

    @Throws(UserAlreadyExistsException::class)
    fun addEmployee(employee: UserEntity): UserEntity {
        if (userRepository.existsByUsername(employee.username)) {
            throw UserAlreadyExistsException("User with username '${employee.username}' already exists")
        }
        return userRepository.save(employee)
    }

    @Throws(EntityNotFoundException::class)
    fun findByUsernameOrThrow(username: String): UserEntity =
        userRepository.findByUsername(username)
            ?: throw EntityNotFoundException("User with username '$username' was not found")

    @Transactional
    @Throws(EntityNotFoundException::class)
    fun deleteEmployee(username: String) {
        // TODO: implement checking for active services for this employee
        val foundUser = findByUsernameOrThrow(username)
        userRepository.delete(foundUser)
    }

    @Transactional
    @Throws(EntityNotFoundException::class, InvalidRoleNameException::class)
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

    @Transactional
    @Throws(EntityNotFoundException::class, InvalidRoleNameException::class)
    fun updateEmployee(
        id: String,
        employeeDTO: EmployeeManagementController.EmployeeDTO,
    ): UserEntity {
        val employee = findByIdOrThrow(id)

        employee.username = employeeDTO.username
        employee.email = employeeDTO.email
        employee.name = employeeDTO.name.lowercase().replaceFirstChar { it.uppercase() }
        employee.surname = employeeDTO.surname.lowercase().replaceFirstChar { it.uppercase() }

        employeeDTO.employeeData?.let { newEmployeeData ->
            employee.employeeData = EmployeeData(
                department = newEmployeeData.department,
                sectors = newEmployeeData.sectors.toList()
            )
        }

        return userRepository.save(employee)
    }
}
