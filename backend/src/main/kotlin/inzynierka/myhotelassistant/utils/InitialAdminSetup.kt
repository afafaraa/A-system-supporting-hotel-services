package inzynierka.myhotelassistant.utils

import inzynierka.myhotelassistant.models.user.Role
import inzynierka.myhotelassistant.models.user.UserEntity
import inzynierka.myhotelassistant.repositories.UserRepository
import org.slf4j.LoggerFactory
import org.springframework.boot.CommandLineRunner
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Profile
import org.springframework.core.env.Environment
import org.springframework.security.crypto.password.PasswordEncoder
import java.util.Scanner

@Profile("!test")
@Configuration
class InitialAdminSetup(
    private val userRepo: UserRepository,
    private val passwordEncoder: PasswordEncoder,
    private val env: Environment,
) {
    private val logger = LoggerFactory.getLogger(InitialAdminSetup::class.java)

    @Bean
    fun adminSetupRunner() =
        CommandLineRunner {
            if (env.activeProfiles.contains("dev")) {
                logger.info("Skipping admin setup in dev environment.")
                return@CommandLineRunner
            }

            val admins = userRepo.findByRole(Role.ADMIN)
            if (admins.isNotEmpty()) {
                logger.info("Admin account(s) already exist. Skipping setup.")
                logger.info(admins.toString())
                return@CommandLineRunner
            }

            // Try creating admin from environment variables
            val envUsername = System.getenv("ADMIN_USERNAME")
            val envPassword = System.getenv("ADMIN_PASSWORD")
            val envEmail = System.getenv("ADMIN_EMAIL")
            val envFirstName = System.getenv("ADMIN_FIRSTNAME") ?: "Admin"
            val envLastName = System.getenv("ADMIN_LASTNAME") ?: "User"

            if (envUsername != null && envPassword != null && envEmail != null) {
                logger.info("Creating admin from environment variables...")
                val admin = UserEntity(
                    username = envUsername,
                    password = passwordEncoder.encode(envPassword),
                    email = envEmail,
                    name = envFirstName,
                    surname = envLastName,
                    role = Role.ADMIN
                )
                userRepo.save(admin)
                logger.info("Admin '${admin.username}' created from environment variables.")
                return@CommandLineRunner
            }

            // Fall back to interactive setup if environment variables are missing
            if (System.console() != null) {
                logger.info("No admin found. Starting interactive setup...")
                setupAdminInteractively()
            } else {
                logger.error("No admin found and no environment variables provided. Startup aborted!")
                throw IllegalStateException(
                    "Cannot create admin: provide ADMIN_USERNAME, ADMIN_PASSWORD, ADMIN_EMAIL"
                )
            }
        }

    private fun setupAdminInteractively() {
        val scanner = Scanner(System.`in`)

        println("\n==== HOTEL MANAGEMENT SYSTEM - INITIAL ADMIN SETUP ====")
        println("This is the first time the application is running.")
        println("Please provide information to create an administrator account.\n")

        fun promptInput(
            fieldName: String,
            regex: Regex,
            description: String,
        ): String {
            var input: String
            while (true) {
                print("Enter $fieldName ($description): ")
                input = scanner.nextLine().trim()
                if (regex.matches(input)) {
                    break
                } else {
                    println("Invalid $fieldName, please try again.")
                }
            }
            return input
        }

        val username =
            promptInput(
                fieldName = "username",
                regex = "^[\\w-_]{4,20}$".toRegex(),
                description = "between 4 and 20 alphanumerical characters with '_' or '-'",
            )
        val password =
            promptInput(
                fieldName = "password",
                regex = "^.{8,}$".toRegex(),
                description = "at least 8 characters long",
            )
        val email =
            promptInput(
                fieldName = "email",
                regex = "^[\\w-.]+@([\\w-]+\\.)+[\\w-]{2,4}$".toRegex(),
                description = "valid email format",
            )
        val firstName =
            promptInput(
                fieldName = "first name",
                regex = "^[a-zA-Z-]{2,20}$".toRegex(),
                description = "max 20 letters",
            )

        val lastName =
            promptInput(
                fieldName = "last name",
                regex = "^[a-zA-Z-]{2,30}$".toRegex(),
                description = "max 30 letters",
            )

        val admin =
            UserEntity(
                username = "admin_$username",
                password = passwordEncoder.encode(password),
                email = email,
                name = firstName.lowercase().replaceFirstChar { it.uppercase() },
                surname = lastName.lowercase().replaceFirstChar { it.uppercase() },
                role = Role.ADMIN,
            )
        userRepo.save(admin)

        logger.info("Interactive admin setup completed. Admin account '$username' created successfully.")

        println("\n==== ADMIN SETUP COMPLETE ====")
        println("Admin name: ${admin.name} ${admin.surname}")
        println("Admin Email: $email")
        println("Admin Username: ${admin.username}")
        println("Admin Password: $password")
        println("==============================\n")
    }
}
