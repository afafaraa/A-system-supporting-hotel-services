package inzynierka.myhotelassistant.utils

import inzynierka.myhotelassistant.models.Role
import inzynierka.myhotelassistant.models.UserEntity
import inzynierka.myhotelassistant.models.order.OrderEntity
import inzynierka.myhotelassistant.models.order.OrderStatus
import inzynierka.myhotelassistant.models.user.Role
import inzynierka.myhotelassistant.models.user.UserEntity
import inzynierka.myhotelassistant.models.room.RoomEntity
import inzynierka.myhotelassistant.models.service.ServiceEntity
import inzynierka.myhotelassistant.models.service.ServiceType
import inzynierka.myhotelassistant.models.service.Time
import inzynierka.myhotelassistant.models.service.Weekday
import inzynierka.myhotelassistant.models.service.WeekdayHour
import inzynierka.myhotelassistant.repositories.OrderRepository
import inzynierka.myhotelassistant.models.user.GuestData
import inzynierka.myhotelassistant.repositories.RoomRepository
import inzynierka.myhotelassistant.repositories.ServiceRepository
import inzynierka.myhotelassistant.repositories.UserRepository
import inzynierka.myhotelassistant.services.ServiceService
import jakarta.annotation.PostConstruct
import org.slf4j.LoggerFactory
import org.springframework.context.annotation.Profile
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Component
import java.time.Instant
import java.time.temporal.ChronoUnit
import java.time.Instant

@Profile("dev")
@Component
class DatabaseSeeder(
    private val userRepo: UserRepository,
    private val passwordEncoder: PasswordEncoder,
    private val roomRepo: RoomRepository,
    private val serviceService: ServiceService,
    private val orderRepository: OrderRepository,
) {

    private val logger = LoggerFactory.getLogger(DatabaseSeeder::class.java)

    @PostConstruct
    fun addDefaultUserToDatabase() {
        addTestAdminAndUser()
        addTestRooms()
        addTestEmployees()
        addUsers()
        addServices()
        addOrders()
        updateUsers()

    }

    private fun addTestAdminAndUser() {
        if (!userRepo.existsByUsername("user")) {
            userRepo.save(UserEntity(
                username = "user",
                password = passwordEncoder.encode("password"),
                role = Role.GUEST,
                email = "test_user@user.test",
                name = "Test",
                surname = "User",
                guestData = GuestData(
                    roomNumber = "002",
                    checkInDate = Instant.now(),
                    checkOutDate = Instant.now().plus(7, ChronoUnit.DAYS),
                )
            ))
            logger.info("Default 'user' added to database")
        }

        if (userRepo.findByRole(Role.ADMIN).isEmpty()) {
            userRepo.save(UserEntity(
                username = "admin",
                password = passwordEncoder.encode("password"),
                role = Role.ADMIN,
                email = "test_admin@admin.test",
                name = "Test",
                surname = "Admin",
            ))
            logger.info("Default 'admin' added to database")
        }
    }

    private fun addTestRooms() {
        if (!roomRepo.existsById("001"))
            roomRepo.save(RoomEntity(number = "001", floor = 0, capacity = 2))
        if (!roomRepo.existsById("002"))
            roomRepo.save(RoomEntity(number = "002", floor = 0, capacity = 3))
        if (!roomRepo.existsById("005"))
            roomRepo.save(RoomEntity(number = "005", floor = 0, capacity = 1))
        if (!roomRepo.existsById("121"))
            roomRepo.save(RoomEntity(number = "121", floor = 1, capacity = 3))
        if (!roomRepo.existsById("117"))
            roomRepo.save(RoomEntity(number = "117", floor = 1, capacity = 4))
        if (!roomRepo.existsById("316"))
            roomRepo.save(RoomEntity(number = "316", floor = 3, capacity = 5))
        if (!roomRepo.existsById("317"))
            roomRepo.save(RoomEntity(number = "317", floor = 3, capacity = 2))
        if (!roomRepo.existsById("319"))
            roomRepo.save(RoomEntity(number = "319", floor = 3, capacity = 3))
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
    private fun addServices() {
        val services = listOf(
            "Room cleaning",
            "Laundry",
            "Spa access",
            "Gym session",
            "Airport shuttle",
            "Breakfast delivery",
            "City tour",
            "Luggage assistance",
            "Wake-up call",
            "Valet parking"
        )

        services.forEachIndexed { index, serviceName ->
            val service = ServiceEntity(
                name = serviceName,
                description = "description",
                price = 10.4,
                type = if (index % 2 == 0) ServiceType.GENERAL_SERVICE else ServiceType.PLACE_RESERVATION,
                disabled = false,
                rating = mutableListOf(3 + (index % 3), 4 + (index % 2)),
                duration = Time(2,0,0),
                maxAvailable = 5,
                weekday = WeekdayHour(
                    day = Weekday.MONDAY,
                    hours = 8 + (index % 4)
                )
            )

            serviceService.save(service)
            logger.info("Service '$serviceName' added to database")
        }
    }
    private fun addOrders() {
        val existingService = serviceService.findByName("Room cleaning")
        if (existingService != null && orderRepository.findAll().isEmpty()) {
            val order = OrderEntity(
                serviceId = existingService.id!!,
                orderDate = Instant.now(),
                orderForDate = Instant.now().plusSeconds(86400), // +1 day
                status = OrderStatus.PENDING
            )
            orderRepository.save(order)
            logger.info("Default order added to database")
        }
    }
    private fun updateUsers() {
        val user = userRepo.findByUsername("user")
        if (user != null) {
            val allOrders = orderRepository.findAll()
            user.orders = allOrders.toMutableList()
            userRepo.save(user)
            logger.info("Added ${allOrders.size} orders to user '${user.username}'")
        } else {
            logger.warn("User with username 'user' not found.")
        }
    }

}