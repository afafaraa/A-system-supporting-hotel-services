package inzynierka.myhotelassistant.controllers

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import inzynierka.myhotelassistant.configs.RSAKeyConfig
import inzynierka.myhotelassistant.configs.SecurityConfig
import inzynierka.myhotelassistant.services.TokenService
import inzynierka.myhotelassistant.services.UserService
import inzynierka.myhotelassistant.utils.email.EmailSender
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.mockito.BDDMockito.given
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest
import org.springframework.context.annotation.Import
import org.springframework.http.MediaType
import org.springframework.security.core.userdetails.User
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.test.context.bean.override.mockito.MockitoBean
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.MvcResult
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.content
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import java.lang.Thread.sleep

@WebMvcTest(HomeController::class, AuthController::class)
@Import(SecurityConfig::class, RSAKeyConfig::class, TokenService::class, UserService::class)
class AuthControllerTest {
    @Autowired lateinit var mvc: MockMvc

    @Autowired lateinit var passwordEncoder: PasswordEncoder

    @Autowired lateinit var tokenService: TokenService

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
        given(userService.loadUserByUsername("user")).willReturn(user)
    }

    @Test
    @Throws(Exception::class)
    fun reAuth() {
        val result: MvcResult =
            mvc
                .perform(
                    post("/open/token")
                        .content("{\"username\":\"user\",\"password\":\"password\"}")
                        .contentType(MediaType.APPLICATION_JSON),
                ).andExpect(status().isOk)
                .andReturn()

        val responseJson = result.response.contentAsString
        val mapper = jacksonObjectMapper()
        val jsonMap: Map<String, String> = mapper.readValue(responseJson)

        val accessToken = jsonMap["accessToken"]
        val refreshToken = jsonMap["refreshToken"]
        println("Access Token: $accessToken")
        println("Refresh Token: $refreshToken")

        // set an access token to be valid for 1 s
        sleep(2000)

        val resultAfterRefresh: MvcResult =
            mvc
                .perform(
                    post("/open/refresh")
                        .content("{\"refreshToken\":\"$refreshToken\"}")
                        .contentType(MediaType.APPLICATION_JSON),
                ).andExpect(status().isOk)
                .andReturn()

        val responseJsonAfterRefresh = resultAfterRefresh.response.contentAsString
        val mapperAfterRefresh = jacksonObjectMapper()
        val jsonMapAfterRefresh: Map<String, String> = mapperAfterRefresh.readValue(responseJsonAfterRefresh)

        val accessTokenAfterRefresh = jsonMapAfterRefresh["accessToken"]
        val refreshTokenAfterRefresh = jsonMapAfterRefresh["refreshToken"]

        println("Access Token: $accessTokenAfterRefresh")
        println("Refresh Token: $refreshTokenAfterRefresh")

        mvc
            .perform(get("/").header("Authorization", "Bearer $accessToken"))
            .andExpect(content().string("Hello, user!"))
    }

    @Test
    @Throws(Exception::class)
    fun resetPassword() {
        val email = "aleksandra.fafara11@gmail.com"
        val token = tokenService.generateResetPasswordToken(1, email)
        val newPassword = "newPassword"

        mvc
            .perform(
                post("/open/reset-password")
                    .content("{\"newPassword\":\"$newPassword\", \"token\":\"$token\"}")
                    .contentType(MediaType.APPLICATION_JSON),
            ).andExpect(status().isOk)
    }
}
