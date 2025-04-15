package inzynierka.myhotelassistant.services

import inzynierka.myhotelassistant.controllers.EmployeeController
import inzynierka.myhotelassistant.exceptions.HttpException
import inzynierka.myhotelassistant.models.Role
import inzynierka.myhotelassistant.repositories.UserRepository
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.BeforeAll
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.test.context.ActiveProfiles
import org.testcontainers.containers.MongoDBContainer
import org.testcontainers.junit.jupiter.Container

@SpringBootTest
@ActiveProfiles("test")
class EmployeeServiceIntegrationTest {

    companion object {
        @Container
        @JvmStatic
        val mongoDBContainer: MongoDBContainer = MongoDBContainer("mongo:8")

        @BeforeAll
        @JvmStatic
        fun setProperties() {
            mongoDBContainer.start()
            System.setProperty("spring.data.mongodb.uri", mongoDBContainer.replicaSetUrl)
        }
    }

    @Autowired
    private lateinit var employeeService: EmployeeService

    @Autowired
    private lateinit var userRepository: UserRepository

    @Autowired
    private lateinit var passwordEncoder: PasswordEncoder

    private val employeeDTOWithoutRoles = EmployeeController.EmployeeDTO(
        username = "jan.kowalski",
        password = "secret123",
        email = "jan@example.com",
        name = "Jan",
        surname = "Kowalski",
    )

    @Test
    fun `should create and add new employee without roles`() {
        val user = employeeService.createEmployee(employeeDTOWithoutRoles.copy(username = "jan.kowalski1"))
        val saved = employeeService.addEmployee(user)
        val found = userRepository.findByUsername("jan.kowalski1")

        assertNotNull(found)
        assertEquals(saved.username, found!!.username)
        assertTrue(passwordEncoder.matches("secret123", found.password))
        assertEquals(saved.email, found.email)
        assertEquals(saved.name, found.name)
        assertEquals(saved.surname, found.surname)
        assertEquals(found.roles.size, 1) // MANAGER + EMPLOYEE
        assertTrue(found.roles.contains(Role.EMPLOYEE)) // default role
    }

    @Test
    fun `should create and add new employee with role`() {
        val user = employeeService.createEmployee(employeeDTOWithoutRoles.copy(username = "jan.kowalski2", roles = setOf(Role.MANAGER.name)))
        employeeService.addEmployee(user)
        val found = userRepository.findByUsername("jan.kowalski2")

        assertNotNull(found)
        assertEquals(found!!.roles.size, 2) // MANAGER + EMPLOYEE
        assertTrue(found.roles.contains(Role.MANAGER))
        assertTrue(found.roles.contains(Role.EMPLOYEE)) // default role
    }

    @Test
    fun `should throw when receiving invalid role name`() {
        assertThrows(HttpException.InvalidRoleNameException::class.java) {
            employeeService.createEmployee(employeeDTOWithoutRoles.copy(roles = setOf("MANAGARMR")))
        }
    }

    @Test
    fun `should throw when adding duplicate employee`() {
        val user = employeeService.createEmployee(employeeDTOWithoutRoles.copy(username = "jan.kowalski3"))
        userRepository.save(user)

        val duplicate = user.copy()

        assertThrows(HttpException.UserAlreadyExistsException::class.java) {
            employeeService.addEmployee(duplicate)
        }
    }

    @Test
    fun `should grant and revoke role`() {
        val user = employeeService.createEmployee(employeeDTOWithoutRoles.copy(username = "jan.kowalski4"))
        userRepository.save(user)

        employeeService.grantRole("jan.kowalski4", "MANAGER")
        val withManager = userRepository.findByUsername("jan.kowalski4")
        assertTrue(withManager!!.roles.contains(Role.MANAGER))

        employeeService.grantRole("jan.kowalski4", "MANAGER")
        val withManagerAgain = userRepository.findByUsername("jan.kowalski4")
        assertTrue(withManagerAgain!!.roles.contains(Role.MANAGER))

        employeeService.revokeRole("jan.kowalski4", "MANAGER")
        val afterRevoke = userRepository.findByUsername("jan.kowalski4")
        assertFalse(afterRevoke!!.roles.contains(Role.MANAGER))

        employeeService.revokeRole("jan.kowalski4", "MANAGER")
        val afterRevokeAgain = userRepository.findByUsername("jan.kowalski4")
        assertFalse(afterRevokeAgain!!.roles.contains(Role.MANAGER))
    }

    @Test
    fun `should throw when managing non-existent employee`() {
        assertThrows(HttpException.UserNotFoundException::class.java) {
            employeeService.grantRole("non.existing.user", "MANAGER")
        }
        assertThrows(HttpException.UserNotFoundException::class.java) {
            employeeService.revokeRole("non.existing.user", "MANAGER")
        }
    }

    @Test
    fun `should throw when receiving invalid role name while managing role`() {
        val user = employeeService.createEmployee(employeeDTOWithoutRoles.copy(username = "jan.kowalski5"))
        userRepository.save(user)

        assertThrows(HttpException.InvalidRoleNameException::class.java) {
            employeeService.grantRole("jan.kowalski5", "MANAGERMR")
        }
        assertThrows(HttpException.InvalidRoleNameException::class.java) {
            employeeService.revokeRole("jan.kowalski5", "MANAGERMR")
        }
    }

    @Test
    fun `should delete employee`() {
        val user = employeeService.createEmployee(employeeDTOWithoutRoles.copy(username = "jan.kowalski6"))
        userRepository.save(user)

        employeeService.deleteEmployee("jan.kowalski6")

        assertNull(userRepository.findByUsername("jan.kowalski6"))
    }

    @Test
    fun `should throw when deleting non-existing employee`() {
        assertThrows(HttpException.UserNotFoundException::class.java) {
            employeeService.deleteEmployee("non.existing.user")
        }
    }
}
