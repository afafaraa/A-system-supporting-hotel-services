package inzynierka.myhotelassistant

import inzynierka.myhotelassistant.configs.RSAKeyConfig
import inzynierka.myhotelassistant.controllers.AuthController
import inzynierka.myhotelassistant.services.TokenService
import inzynierka.myhotelassistant.configs.SecurityConfig
import inzynierka.myhotelassistant.controllers.HomeController
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.mockito.BDDMockito.given
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest
import org.springframework.context.annotation.Import
import org.springframework.http.MediaType
import org.springframework.security.core.userdetails.User
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.security.test.context.support.WithMockUser
import org.springframework.test.context.bean.override.mockito.MockitoBean
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.MvcResult
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.content
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

@WebMvcTest(HomeController::class, AuthController::class)
@Import(SecurityConfig::class, RSAKeyConfig::class, TokenService::class)
class HomeControllerTest(@Autowired val mvc: MockMvc, @Autowired val passwordEncoder: PasswordEncoder) {

    @MockitoBean
    private lateinit var userDetailsService: UserDetailsService

    @BeforeEach
    fun setup() {
        val user = User.withUsername("user")
            .password(passwordEncoder.encode("password"))
            .roles("USER")
            .build()
        given(userDetailsService.loadUserByUsername("user")).willReturn(user)
    }

    @Test
    @Throws(Exception::class)
    fun rootWhenUnauthenticatedThen401() {
        mvc.perform(get("/"))
            .andExpect(status().isUnauthorized())
    }

    @Test
    @Throws(Exception::class)
    fun rootWhenUnauthenticatedThenSaysHelloUser() {
        val result: MvcResult = mvc.perform(post("/token")
            .content("{\"username\":\"user\",\"password\":\"password\"}")
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andReturn()

        val token = result.response.contentAsString

        mvc.perform(get("/").header("Authorization", "Bearer $token"))
            .andExpect(content().string("Hello, user!"))

        mvc.perform(get("/secured").header("Authorization", "Bearer $token"))
            .andExpect(status().isForbidden)
    }

    @Test
    @WithMockUser
    @Throws(Exception::class)
    fun rootWithMockUserStatusIsOK() {
        mvc.perform(get("/"))
            .andExpect(status().isOk())
    }
}
