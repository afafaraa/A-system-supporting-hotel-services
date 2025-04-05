package inzynierka.myhotelassistant.utils

import inzynierka.myhotelassistant.models.user.Role
import inzynierka.myhotelassistant.models.user.UserEntity
import inzynierka.myhotelassistant.repositories.UserRepository
import jakarta.annotation.PostConstruct
import org.slf4j.LoggerFactory
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Component

@Component
class DatabaseSeeder(private val userRepo: UserRepository, private val passwordEncoder: PasswordEncoder) {

    private val logger = LoggerFactory.getLogger(DatabaseSeeder::class.java)

    @PostConstruct
    fun addDefaultUserToDatabase() {
        if (!userRepo.existsByUsername("user")) {
            val user = UserEntity(
                username = "user",
                password = passwordEncoder.encode("password"),
                roles = mutableSetOf(Role.GUEST),
                email = ""
            )
            userRepo.save(user)
            logger.info("Default \'user\' added to database")
        }

        if (!userRepo.existsByUsername("admin")) {
            val admin = UserEntity(
                username = "admin",
                password = passwordEncoder.encode("password"),
                roles = mutableSetOf(Role.ADMIN, Role.MANAGER),
                email = ""
            )
            userRepo.save(admin)
            logger.info("Default \'admin\' added to database")
        }
    }
}