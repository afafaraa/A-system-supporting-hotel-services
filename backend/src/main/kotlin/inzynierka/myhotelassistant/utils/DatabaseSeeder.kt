package inzynierka.myhotelassistant.utils

import inzynierka.myhotelassistant.models.Role
import inzynierka.myhotelassistant.models.UserEntity
import inzynierka.myhotelassistant.services.UserService
import jakarta.annotation.PostConstruct
import org.slf4j.LoggerFactory
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Component

@Component
class DatabaseSeeder(private val userService: UserService, private val passwordEncoder: PasswordEncoder) {

    private val logger = LoggerFactory.getLogger(DatabaseSeeder::class.java)

    @PostConstruct
    fun addDefaultUserToDatabase() {
        if (userService.findByUsername("user") == null) {
            val user = UserEntity(
                username = "user",
                password = passwordEncoder.encode("password"),
                roles = listOf(Role.USER)
            )
            userService.save(user)
            logger.info("Default \'user\' added to database")
        }

        if (userService.findByUsername("admin") == null) {
            val admin = UserEntity(
                username = "admin",
                password = passwordEncoder.encode("password"),
                roles = listOf(Role.ADMIN)
            )
            userService.save(admin)
            logger.info("Default \'admin\' added to database")
        }
    }
}