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
    fun `should create and add new employee without employee role`() {
        val user = employeeService.createEmployee(employeeDTOWithoutRoles.copy(username = "jan.kowalski1"))
        val saved = employeeService.addEmployee(user)
        val found = userRepository.findByUsername("jan.kowalski1")

        assertNotNull(found)
        assertEquals(saved.username, found!!.username)
        assertTrue(passwordEncoder.matches("secret123", found.password))
        assertEquals(saved.email, found.email)
        assertEquals(saved.name, found.name)
        assertEquals(saved.surname, found.surname)
        assertTrue(found.role == Role.EMPLOYEE) // default role
    }

    @Test
    fun `should create and add new employee with manager role`() {
        val user = employeeService.createEmployee(employeeDTOWithoutRoles.copy(username = "jan.kowalski2", role = Role.MANAGER.name))
        employeeService.addEmployee(user)
        val found = userRepository.findByUsername("jan.kowalski2")

        assertNotNull(found)
        assertTrue(found!!.role == Role.MANAGER)
    }

    @Test
    fun `should throw when receiving invalid role name`() {
        assertThrows(HttpException.InvalidRoleNameException::class.java) {
            employeeService.createEmployee(employeeDTOWithoutRoles.copy(role = "MANAGARMR"))
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

        employeeService.changeRole("jan.kowalski4", "MANAGER")
        val withManager = userRepository.findByUsername("jan.kowalski4")
        assertTrue(withManager!!.role == Role.MANAGER)

        assertThrows(HttpException.InvalidRoleNameException::class.java) {
            employeeService.changeRole("jan.kowalski4", "MANAGER")
        }

        employeeService.changeRole("jan.kowalski4", "EMPLOYEE")
        val afterRevoke = userRepository.findByUsername("jan.kowalski4")
        assertTrue(afterRevoke!!.role == Role.EMPLOYEE)
    }

    @Test
    fun `should throw when managing non-existent employee`() {
        assertThrows(HttpException.UserNotFoundException::class.java) {
            employeeService.changeRole("non.existing.user", "MANAGER")
        }
        assertThrows(HttpException.UserNotFoundException::class.java) {
            employeeService.changeRole("non.existing.user", "EMPLOYEE")
        }
    }

    @Test
    fun `should throw when receiving invalid role name while managing role`() {
        val user = employeeService.createEmployee(employeeDTOWithoutRoles.copy(username = "jan.kowalski5"))
        userRepository.save(user)

        assertThrows(HttpException.InvalidRoleNameException::class.java) {
            employeeService.changeRole("jan.kowalski5", "MANAGERMR")
        }
    }

    @Test
    fun `should throw when receiving guest or admin role`() {
        val user = employeeService.createEmployee(employeeDTOWithoutRoles.copy(username = "jan.kowalski6"))
        userRepository.save(user)

        assertThrows(HttpException.InvalidRoleNameException::class.java) {
            employeeService.changeRole("jan.kowalski6", "GUEST")
        }
        assertThrows(HttpException.InvalidRoleNameException::class.java) {
            employeeService.changeRole("jan.kowalski6", "ADMIN")
        }
    }

    @Test
    fun `should delete employee`() {
        val user = employeeService.createEmployee(employeeDTOWithoutRoles.copy(username = "jan.kowalski7"))
        userRepository.save(user)

        employeeService.deleteEmployee("jan.kowalski7")

        assertNull(userRepository.findByUsername("jan.kowalski7"))
    }

    @Test
    fun `should throw when deleting non-existing employee`() {
        assertThrows(HttpException.UserNotFoundException::class.java) {
            employeeService.deleteEmployee("non.existing.user")
        }
    }
}
