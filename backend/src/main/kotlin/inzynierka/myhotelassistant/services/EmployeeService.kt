package inzynierka.myhotelassistant.services

import inzynierka.myhotelassistant.controllers.user.EmployeeManagementController
import inzynierka.myhotelassistant.dto.ScheduleData
import inzynierka.myhotelassistant.exceptions.HttpException.EntityNotFoundException
import inzynierka.myhotelassistant.exceptions.HttpException.InvalidRoleNameException
import inzynierka.myhotelassistant.exceptions.HttpException.UserAlreadyExistsException
import inzynierka.myhotelassistant.models.user.Role
import inzynierka.myhotelassistant.models.user.Role.Companion.employeeRoles
import inzynierka.myhotelassistant.models.user.UserEntity
import inzynierka.myhotelassistant.repositories.ScheduleRepository
import inzynierka.myhotelassistant.repositories.UserRepository
import inzynierka.myhotelassistant.utils.SchedulesToScheduleDataConverter
import org.springframework.data.domain.Pageable
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.DayOfWeek
import java.time.LocalDate
import java.time.temporal.TemporalAdjusters
import kotlin.jvm.Throws

@Service
class EmployeeService(
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder,
    private val scheduleRepository: ScheduleRepository,
    private val scheduleDateConverter: SchedulesToScheduleDataConverter,
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

    fun findAllAssignedSchedulesByUsername(
        date: LocalDate,
        username: String,
    ): ScheduleData {
        val employeeId = findByUsernameOrThrow(username).id!!
        return findAllAssignedSchedulesByEmployeeId(date, employeeId)
    }

    private fun findAllAssignedSchedulesByEmployeeId(
        date: LocalDate,
        employeeId: String,
    ): ScheduleData {
        val (monday, sunday) = getWeekBounds(date)
        val foundSchedules =
            scheduleRepository.findByEmployeeIdAndServiceDateBetween(
                employeeId = employeeId,
                startDate = monday.atStartOfDay(),
                endDate = sunday.atTime(23, 59, 59),
            )
        if (foundSchedules.isEmpty()) {
            throw EntityNotFoundException("No schedules found for employee with id '$employeeId' in the specified week")
        }
        return scheduleDateConverter.convert(foundSchedules, date)
    }

    private fun getWeekBounds(day: LocalDate): Pair<LocalDate, LocalDate> {
        val monday = day.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY))
        val sunday = day.with(TemporalAdjusters.nextOrSame(DayOfWeek.SUNDAY))
        return monday to sunday
    }
}
