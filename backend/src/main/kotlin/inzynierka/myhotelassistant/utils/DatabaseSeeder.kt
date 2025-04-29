package inzynierka.myhotelassistant.utils

import inzynierka.myhotelassistant.models.Role
import inzynierka.myhotelassistant.models.UserEntity
import inzynierka.myhotelassistant.models.room.RoomEntity
import inzynierka.myhotelassistant.repositories.RoomRepository
import inzynierka.myhotelassistant.repositories.UserRepository
import jakarta.annotation.PostConstruct
import org.slf4j.LoggerFactory
import org.springframework.context.annotation.Profile
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Component

@Profile("dev")
@Component
class DatabaseSeeder(
    private val userRepo: UserRepository,
    private val passwordEncoder: PasswordEncoder,
    private val roomRepo: RoomRepository
) {

    private val logger = LoggerFactory.getLogger(DatabaseSeeder::class.java)

    @PostConstruct
    fun addDefaultUserToDatabase() {
        if (!userRepo.existsByUsername("user")) {
            val user = UserEntity(
                username = "user",
                password = passwordEncoder.encode("password"),
                role = Role.GUEST,
                email = "test_user@user.test",
                name = "Test",
                surname = "User",
            )
            userRepo.save(user)
            logger.info("Default 'user' added to database")
        }

        if (userRepo.findByRole(Role.ADMIN).isEmpty()) {
            val admin = UserEntity(
                username = "admin",
                password = passwordEncoder.encode("password"),
                role = Role.ADMIN,
                email = "test_admin@admin.test",
                name = "Test",
                surname = "Admin",
            )
            userRepo.save(admin)
            logger.info("Default 'admin' added to database")
        }

        if (!roomRepo.existsById("1")) {
            val room = RoomEntity(
                id = "1",
                floor = 1,
                roomNumber = 1,
                capacity = 1,
            )
            roomRepo.save(room)
            logger.info("Default 'room' added to database")
        }
        addTestEmployees()
    }

    private fun addTestEmployees() {
        if (!userRepo.existsByUsername("employee1"))
            userRepo.save(UserEntity(
                role = Role.MANAGER,
                username = "employee1",
                password = passwordEncoder.encode("password"),
                email = "employee1@gmail.com",
                name = "Joe",
                surname = "Doe",
            ))
        if (!userRepo.existsByUsername("employee2"))
            userRepo.save(UserEntity(
                role = Role.RECEPTIONIST,
                username = "employee2",
                password = passwordEncoder.encode("password123"),
                email = "ann.smith@mymail.com",
                name = "Anna",
                surname = "Smith",
            ))
        if (!userRepo.existsByUsername("employee3"))
            userRepo.save(UserEntity(
                role = Role.EMPLOYEE,
                username = "employee3",
                password = passwordEncoder.encode("easy"),
                email = "c.brown@yahoo.com",
                name = "Charlie",
                surname = "Brown",
            ))
    }
}
