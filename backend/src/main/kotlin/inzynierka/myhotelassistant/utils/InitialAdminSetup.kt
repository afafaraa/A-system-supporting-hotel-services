package inzynierka.myhotelassistant.utils

import inzynierka.myhotelassistant.models.user.Role
import inzynierka.myhotelassistant.models.user.UserEntity
import inzynierka.myhotelassistant.repositories.UserRepository
import inzynierka.myhotelassistant.services.UserService
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.boot.CommandLineRunner
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.core.env.Environment
import org.springframework.security.crypto.password.PasswordEncoder
import java.time.Instant
import java.util.Scanner

@Configuration
class InitialAdminSetup(
    private val userService: UserService,
    private val userRepo: UserRepository,
    private val passwordEncoder: PasswordEncoder,
    private val environment: Environment
) {

    private val logger = LoggerFactory.getLogger(InitialAdminSetup::class.java)

    @Value("\${initial.admin.username:admin}")
    private lateinit var defaultUsername: String

    @Value("\${initial.admin.password:admin123}")
    private lateinit var defaultPassword: String

    @Value("\${initial.admin.email:admin@myhotel.com}")
    private lateinit var defaultEmail: String

    @Bean
    fun adminSetupRunner(): CommandLineRunner = CommandLineRunner { args ->
        if (environment.activeProfiles.contains("dev")) {
            logger.info("Skipping interactive admin setup in dev environment.")
            return@CommandLineRunner
        }
        val admins = userRepo.findByRolesContaining(Role.ADMIN)
        if (admins.isNotEmpty()) {
            logger.info("Admin account(s) already exist. Skipping interactive setup.")
            logger.info(admins.toString())
            return@CommandLineRunner
        }

        logger.info("No admin account found. Starting interactive admin setup...")
        setupAdminInteractively()
    }

    private fun setupAdminInteractively() {
        val scanner = Scanner(System.`in`)

        println("\n==== HOTEL MANAGEMENT SYSTEM - INITIAL ADMIN SETUP ====")
        println("This is the first time the application is running.")
        println("Please provide information to create an administrator account.\n")

        var username: String
        do {
            print("Enter admin username (minimum 4 characters): ")
            username = scanner.nextLine().trim()
            if (username.length < 4) {
                println("Username too short. Please try again.")
            }
        } while (username.length < 4)

        var password: String
        do {
            print("Enter admin password (minimum 8 characters): ")
            password = scanner.nextLine().trim()
            if (password.length < 8) {
                println("Password too short. Please try again.")
            }
        } while (password.length < 8)

        print("Enter admin email: ")
        val email = scanner.nextLine().trim()

        print("Enter admin first name: ")
        val firstName = scanner.nextLine().trim()

        print("Enter admin last name: ")
        val lastName = scanner.nextLine().trim()

        val admin = UserEntity(
            id = null,
            username = username,
            password = passwordEncoder.encode(password),
            email = email,
            name = firstName,
            surname = lastName,
            roles = mutableSetOf(Role.ADMIN, Role.MANAGER),
            checkInDate = Instant.now(),
            checkOutDate = Instant.now()
        )

        userService.save(admin)
        logger.info("Interactive admin setup completed. Admin account '{}' created successfully.", username)

        println("\n==== ADMIN SETUP COMPLETE ====")
        println("Admin Username: $username")
        println("Admin Email: $email")
        println("=================================\n")
    }
}
