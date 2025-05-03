package inzynierka.myhotelassistant.controllers

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import inzynierka.myhotelassistant.configs.RSAKeyConfig
import inzynierka.myhotelassistant.configs.SecurityConfig
import inzynierka.myhotelassistant.services.TokenService
import inzynierka.myhotelassistant.services.UserService
import inzynierka.myhotelassistant.utils.EmailSender
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.mockito.BDDMockito
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest
import org.springframework.context.annotation.Import
import org.springframework.http.MediaType
import org.springframework.security.core.userdetails.User
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.security.test.context.support.WithMockUser
import org.springframework.test.context.bean.override.mockito.MockitoBean
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.MvcResult
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultMatchers

@WebMvcTest(HomeController::class, AuthController::class)
@Import(SecurityConfig::class, RSAKeyConfig::class, TokenService::class)
class HomeControllerTest {
    @Autowired
    private lateinit var mvc: MockMvc

    @Autowired
    private lateinit var passwordEncoder: PasswordEncoder

    @MockitoBean
    private lateinit var userService: UserService

    @MockitoBean
    private lateinit var emailSender: EmailSender

    @BeforeEach
    fun setup() {
        val user =
            User
                .withUsername("user")
                .password(passwordEncoder.encode("password"))
                .roles("USER")
                .build()
        BDDMockito.given(userService.loadUserByUsername("user")).willReturn(user)
    }

    @Test
    @Throws(Exception::class)
    fun rootWhenUnauthenticatedThen401() {
        mvc
            .perform(MockMvcRequestBuilders.get("/"))
            .andExpect(MockMvcResultMatchers.status().isUnauthorized())
    }

    @Test
    @Throws(Exception::class)
    fun rootWhenUnauthenticatedThenSaysHelloUser() {
        val result: MvcResult =
            mvc
                .perform(
                    MockMvcRequestBuilders
                        .post("/open/token")
                        .content("{\"username\":\"user\",\"password\":\"password\"}")
                        .contentType(MediaType.APPLICATION_JSON),
                ).andExpect(MockMvcResultMatchers.status().isOk)
                .andReturn()

        val responseJson = result.response.contentAsString
        val mapper = jacksonObjectMapper()
        val jsonMap: Map<String, String> = mapper.readValue(responseJson)

        val accessToken = jsonMap["accessToken"]
        println("Access Token: $accessToken")

        mvc
            .perform(MockMvcRequestBuilders.get("/").header("Authorization", "Bearer $accessToken"))
            .andExpect(MockMvcResultMatchers.content().string("Hello, user!"))

        mvc
            .perform(MockMvcRequestBuilders.get("/secured").header("Authorization", "Bearer $accessToken"))
            .andExpect(MockMvcResultMatchers.status().isForbidden)
    }

    @Test
    @WithMockUser
    @Throws(Exception::class)
    fun rootWithMockUserStatusIsOK() {
        mvc
            .perform(MockMvcRequestBuilders.get("/"))
            .andExpect(MockMvcResultMatchers.status().isOk())
    }
}
