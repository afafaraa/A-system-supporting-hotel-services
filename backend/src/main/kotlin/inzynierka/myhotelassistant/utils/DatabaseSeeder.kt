package inzynierka.myhotelassistant.utils

import inzynierka.myhotelassistant.models.Role
import inzynierka.myhotelassistant.models.UserEntity
import inzynierka.myhotelassistant.models.order.OrderEntity
import inzynierka.myhotelassistant.models.order.OrderStatus
import inzynierka.myhotelassistant.models.room.RoomEntity
import inzynierka.myhotelassistant.models.service.ServiceEntity
import inzynierka.myhotelassistant.models.service.ServiceType
import inzynierka.myhotelassistant.models.service.Time
import inzynierka.myhotelassistant.models.service.Weekday
import inzynierka.myhotelassistant.models.service.WeekdayHour
import inzynierka.myhotelassistant.repositories.OrderRepository
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

    private fun addUsers() {
        if (!userRepo.existsByUsername("user")) {
            val user = UserEntity(
                username = "user",
                password = passwordEncoder.encode("password"),
                role = Role.GUEST,
                email = "test_user@user.test"
            )
            userRepo.save(user)
            logger.info("Default 'user' added to database")
        }

        if (userRepo.findByRole(Role.ADMIN).isEmpty()) {
            val admin = UserEntity(
                username = "admin",
                password = passwordEncoder.encode("password"),
                role = Role.ADMIN,
                email = "test_admin@admin.test"
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

    @PostConstruct
    fun seed() {
        addUsers()
        addServices()
        addOrders()
        updateUsers()
    }
}