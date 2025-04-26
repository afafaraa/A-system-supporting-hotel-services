package inzynierka.myhotelassistant.controllers

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import inzynierka.myhotelassistant.configs.RSAKeyConfig
import inzynierka.myhotelassistant.configs.SecurityConfig
import inzynierka.myhotelassistant.controllers.user.EmployeeController
import inzynierka.myhotelassistant.models.Role
import inzynierka.myhotelassistant.models.UserEntity
import inzynierka.myhotelassistant.services.EmployeeService
import jakarta.validation.Validation
import org.junit.jupiter.api.Test
import org.mockito.BDDMockito.given
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest
import org.springframework.context.annotation.Import
import org.springframework.http.MediaType
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.test.context.support.WithMockUser
import org.springframework.test.context.bean.override.mockito.MockitoBean
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import kotlin.test.assertEquals

@WebMvcTest(EmployeeController::class)
@Import(SecurityConfig::class, RSAKeyConfig::class)
class EmployeeControllerTest {

    @Autowired
    lateinit var mvc: MockMvc

    @MockitoBean
    lateinit var employeeService: EmployeeService

    @MockitoBean
    private lateinit var userDetailsService: UserDetailsService

    @Test
    @WithMockUser(roles = ["GUEST", "EMPLOYEE", "RECEPTIONIST"])
    fun `should return 403 forbidden when trying with user without permissions`() {
        mvc.perform(get("/management/employees?username=irrelevant"))
            .andExpect(status().isForbidden)
    }

    @Test
    fun `should validate EmployeeDTO fields`() {
        val validator = Validation.buildDefaultValidatorFactory().validator

        var invalidRequest = EmployeeController.EmployeeDTO(
            username = "no", // to short
            password = "123", // to short
            email = "invalid-email", // invalid email
            name = "john", // okay
            surname = "doe", // okay
            role = "invalid-role"
        )
        var violations = validator.validate(invalidRequest)
        assertEquals(4, violations.size)

        invalidRequest = EmployeeController.EmployeeDTO(
            username = "invalid characters!@#", // invalid characters
            password = "thats a good password",
            email = "test.email@test.c",
            name = "john-9998", // invalid characters
            surname = "dOe-San",
            role = "manAger"
        )
        violations = validator.validate(invalidRequest)
        assertEquals(2, violations.size)
    }
    
    @Test
    @WithMockUser(roles = ["MANAGER"])
    fun addEmployeeTest() {
        val employeeDTO = EmployeeController.EmployeeDTO(
            username = "employee",
            password = "password123",
            email = "employee@example.com",
            name = "john",
            surname = "Doe",
        )
        val expectedEmployee = UserEntity(
            username = "employee",
            password = "password123",
            email = "employee@example.com",
            name = "John",
            surname = "Doe",
            role = Role.EMPLOYEE,
        )

        given(employeeService.createEmployee(employeeDTO)).willReturn(expectedEmployee)
        given(employeeService.addEmployee(expectedEmployee)).willReturn(expectedEmployee.copy())

        val result = mvc.perform(post("/management/employees")
                .contentType(MediaType.APPLICATION_JSON)
                .content(jacksonObjectMapper().writeValueAsString(employeeDTO)))
            .andExpect(status().isCreated)
            .andReturn()

        val map: Map<String, Any> = jacksonObjectMapper().readValue(result.response.contentAsString)
        val actualEmployee = UserEntity(
            username = map["username"] as String,
            password = map["password"] as String,
            email = map["email"] as String,
            name = map["name"] as String,
            surname = map["surname"] as String,
            role = Role.valueOf(map["role"] as String),
        )

        expectedEmployee.password = "**********"
        assertEquals(expectedEmployee, actualEmployee)
    }

    @Test
    @WithMockUser(roles = ["MANAGER"])
    fun getEmployeeWithUsernameTest() {
        val expectedEmployee = UserEntity(
            username = "employee",
            password = "password123",
            email = "employee@example.com",
            name = "John",
            surname = "Doe",
            role = Role.EMPLOYEE,
        )
        given(employeeService.findByUsernameOrThrow("employee")).willReturn(expectedEmployee.copy())

        val result = mvc.perform(get("/management/employees?username=employee"))
            .andExpect(status().isOk)
            .andReturn()

        val map: Map<String, Any> = jacksonObjectMapper().readValue(result.response.contentAsString)
        val actualEmployee = UserEntity(
            username = map["username"] as String,
            password = map["password"] as String,
            email = map["email"] as String,
            name = map["name"] as String,
            surname = map["surname"] as String,
            role = Role.valueOf(map["role"] as String),
        )

        expectedEmployee.password = "**********"
        assertEquals(expectedEmployee, actualEmployee)
    }
}