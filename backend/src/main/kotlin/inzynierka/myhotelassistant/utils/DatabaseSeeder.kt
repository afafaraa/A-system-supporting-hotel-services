package inzynierka.myhotelassistant.utils

import inzynierka.myhotelassistant.models.order.OrderEntity
import inzynierka.myhotelassistant.models.room.RoomEntity
import inzynierka.myhotelassistant.models.schedule.ScheduleEntity
import inzynierka.myhotelassistant.models.service.ServiceEntity
import inzynierka.myhotelassistant.models.service.ServiceType
import inzynierka.myhotelassistant.models.service.WeekdayHour
import inzynierka.myhotelassistant.models.user.GuestData
import inzynierka.myhotelassistant.models.user.Role
import inzynierka.myhotelassistant.models.user.UserEntity
import inzynierka.myhotelassistant.repositories.OrderRepository
import inzynierka.myhotelassistant.repositories.RoomRepository
import inzynierka.myhotelassistant.repositories.ScheduleRepository
import inzynierka.myhotelassistant.repositories.UserRepository
import inzynierka.myhotelassistant.services.ServiceService
import jakarta.annotation.PostConstruct
import org.slf4j.LoggerFactory
import org.springframework.context.annotation.Profile
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Component
import java.time.DayOfWeek
import java.time.Instant
import java.time.LocalDate
import java.time.ZoneId
import java.time.temporal.ChronoUnit
import java.time.temporal.TemporalAdjusters
import kotlin.collections.forEach
import kotlin.math.roundToInt
import kotlin.random.Random
import kotlin.time.Duration.Companion.hours
import kotlin.time.Duration.Companion.minutes
import kotlin.time.times

@Profile("dev")
@Component
class DatabaseSeeder(
    private val userRepo: UserRepository,
    private val passwordEncoder: PasswordEncoder,
    private val roomRepo: RoomRepository,
    private val serviceService: ServiceService,
    private val orderRepo: OrderRepository,
    private val scheduleRepository: ScheduleRepository,
) {
    private val logger = LoggerFactory.getLogger(DatabaseSeeder::class.java)

    @PostConstruct
    fun seedDatabaseWithTestData() {
        try {
            addTestAdminAndUser()
            addTestRooms()
            addTestEmployees()
            addServices()
            addOrders()
            updateUsers()
            addSchedule()
        } catch (e: Exception) {
            logger.error(e.message, e)
            throw e
        }
    }

    private fun addTestAdminAndUser() {
        if (!userRepo.existsByUsername("user")) {
            userRepo.save(
                UserEntity(
                    username = "user",
                    password = passwordEncoder.encode("password"),
                    role = Role.GUEST,
                    email = "test_user@user.test",
                    name = "Test",
                    surname = "User",
                    guestData =
                        GuestData(
                            roomNumber = "002",
                            checkInDate = Instant.now(),
                            checkOutDate = Instant.now().plus(7, ChronoUnit.DAYS),
                        ),
                ),
            )
            logger.info("Default 'user' added to database")
        }

        if (userRepo.findByRole(Role.ADMIN).isEmpty()) {
            userRepo.save(
                UserEntity(
                    username = "admin",
                    password = passwordEncoder.encode("password"),
                    role = Role.ADMIN,
                    email = "test_admin@admin.test",
                    name = "Test",
                    surname = "Admin",
                ),
            )
            logger.info("Default 'admin' added to database")
        }
    }

    private fun addTestRooms() {
        if (!roomRepo.existsById("001")) {
            roomRepo.save(RoomEntity(number = "001", floor = 0, capacity = 2))
        }
        if (!roomRepo.existsById("002")) {
            roomRepo.save(RoomEntity(number = "002", floor = 0, capacity = 3))
        }
        if (!roomRepo.existsById("005")) {
            roomRepo.save(RoomEntity(number = "005", floor = 0, capacity = 1))
        }
        if (!roomRepo.existsById("121")) {
            roomRepo.save(RoomEntity(number = "121", floor = 1, capacity = 3))
        }
        if (!roomRepo.existsById("117")) {
            roomRepo.save(RoomEntity(number = "117", floor = 1, capacity = 4))
        }
        if (!roomRepo.existsById("316")) {
            roomRepo.save(RoomEntity(number = "316", floor = 3, capacity = 5))
        }
        if (!roomRepo.existsById("317")) {
            roomRepo.save(RoomEntity(number = "317", floor = 3, capacity = 2))
        }
        if (!roomRepo.existsById("319")) {
            roomRepo.save(RoomEntity(number = "319", floor = 3, capacity = 3))
        }
    }

    private fun addTestEmployees() {
        if (!userRepo.existsByUsername("employee1")) {
            userRepo.save(
                UserEntity(
                    role = Role.MANAGER,
                    username = "employee1",
                    password = passwordEncoder.encode("password"),
                    email = "employee1@gmail.com",
                    name = "Joe",
                    surname = "Doe",
                ),
            )
        }
        if (!userRepo.existsByUsername("employee2")) {
            userRepo.save(
                UserEntity(
                    role = Role.RECEPTIONIST,
                    username = "employee2",
                    password = passwordEncoder.encode("password123"),
                    email = "ann.smith@mymail.com",
                    name = "Anna",
                    surname = "Smith",
                ),
            )
        }
        if (!userRepo.existsByUsername("employee3")) {
            userRepo.save(
                UserEntity(
                    role = Role.EMPLOYEE,
                    username = "employee3",
                    password = passwordEncoder.encode("easy"),
                    email = "c.brown@yahoo.com",
                    name = "Charlie",
                    surname = "Brown",
                ),
            )
        }
    }

    private fun addServices() {
        serviceDataList.forEachIndexed { index, serviceData ->
            if (serviceService.findByName(serviceData.name) == null) {
                val random = Random(System.currentTimeMillis() + index)
                val duration = random.nextInt(1, 3).hours + random.nextInt(0, 4) * 15.minutes
                val weeklySchedule =
                    DayOfWeek.entries
                        .map { day ->
                            val startHour = random.nextInt(6, 18)
                            WeekdayHour(
                                day = day,
                                startHour = startHour,
                                endHour = startHour + random.nextInt(1, 4),
                            )
                        }.toMutableList()

                val service =
                    ServiceEntity(
                        name = serviceData.name,
                        description = serviceData.description,
                        price = (5 + random.nextDouble(5.0, 50.0)).let { (it * 100).roundToInt() / 100.0 },
                        type = if (random.nextBoolean()) ServiceType.GENERAL_SERVICE else ServiceType.PLACE_RESERVATION,
                        disabled = false,
                        rating = List(random.nextInt(3, 7)) { 3 + random.nextInt(3) }.toMutableList(),
                        duration = duration,
                        maxAvailable = random.nextInt(1, 10),
                        weekday = weeklySchedule,
                        image = serviceData.imageUrl,
                    )
                serviceService.save(service)
                logger.info("Service '${serviceData.name}' added to database")
            }
        }
    }

    private fun addOrders() {
        val existingService = serviceService.findByName("Room cleaning")
        if (existingService != null && orderRepo.findAll().isEmpty()) {
            val order =
                OrderEntity(
                    serviceId = existingService.id!!,
                    orderDate = Instant.now(),
                    orderForDate = Instant.now().plus(1, ChronoUnit.DAYS),
                )
            orderRepo.save(order)
            logger.info("Default order added to database")
        }
    }

    fun addSchedule() {
        val services = serviceService.findAll()
        val today = LocalDate.now()
        val zoneId = ZoneId.systemDefault()

        services.forEach { service ->
            service.weekday.forEach { weekdayHour ->
                val targetDate = today.with(TemporalAdjusters.nextOrSame(weekdayHour.day))
                val dateTime = targetDate.atTime(weekdayHour.startHour, 0)
                val instant = dateTime.atZone(zoneId).toInstant()

                if (service.id != null) {
                    val schedule =
                        ScheduleEntity(
                            serviceId = service.id,
                            serviceDate = instant,
                            weekday = weekdayHour.day,
                            active = true,
                        )
                    logger.info("Schedule added: ${service.name} on ${weekdayHour.day} at $dateTime")

                    scheduleRepository.save(schedule)
                }
            }
        }
    }

    private fun updateUsers() {
        val user = userRepo.findByUsername("user")
        if (user?.guestData != null) {
            val allOrders = orderRepo.findAll()
            user.guestData.orders.clear()
            user.guestData.orders.addAll(allOrders)
            userRepo.save(user)
            logger.info("Added ${allOrders.size} orders to user '${user.username}'")
        } else {
            logger.warn("User with username 'user' not found.")
        }
    }

    data class ServiceData(
        val name: String,
        val description: String,
        val imageUrl: String,
    )

    val serviceDataList =
        listOf(
            ServiceData(
                "Room cleaning",
                "Thorough cleaning of your room, including dusting, vacuuming, and sanitizing surfaces.",
                "https://i.pinimg.com/736x/b0/9b/77/b09b77d8e801fac4a0d2baa99dbff57b.jpg",
            ),
            ServiceData(
                "Laundry",
                "Professional washing, drying, and folding of your clothes using eco-friendly detergents.",
                "https://i.pinimg.com/736x/9d/42/6d/9d426da81011154cfa1e7aa01782c1ca.jpg",
            ),
            ServiceData(
                "Spa access",
                "Relax in our luxury spa with sauna, jacuzzi, and massage services.",
                "https://i.pinimg.com/736x/9f/88/01/9f880100ad711d2173157e9c9452ec19.jpg",
            ),
            ServiceData(
                "Gym session",
                "Access to a fully equipped fitness center with personal trainers available.",
                "https://i.pinimg.com/736x/3f/1b/c7/3f1bc780ba6582314b5e71b7a46efe1e.jpg",
            ),
            ServiceData(
                "Airport shuttle",
                "Convenient transport to and from the airport with comfortable seating and AC.",
                "https://i.pinimg.com/736x/69/56/cb/6956cbcb567a3206dd01d2e00848d21a.jpg",
            ),
            ServiceData(
                "Breakfast delivery",
                "Enjoy a fresh breakfast delivered straight to your room every morning.",
                "https://i.pinimg.com/736x/4a/d0/c7/4ad0c71087dfaa177127736d6ff65898.jpg",
            ),
            ServiceData(
                "City tour",
                "Guided tour of the city's main attractions, history, and local culture.",
                "https://i.pinimg.com/736x/cb/ba/bb/cbbabb1bd63a761bad5fe0db8db7465c.jpg",
            ),
            ServiceData(
                "Valet parking",
                "Fast and secure valet parking service available 24/7.",
                "https://i.pinimg.com/736x/4b/4a/a6/4b4aa6644b4e9db0d14d202917b18c1b.jpg",
            ),
            ServiceData(
                "Tennis court",
                "Access to our outdoor tennis court, including equipment rental.",
                "https://i.pinimg.com/736x/f4/4c/44/f44c44e8fa684046a1133ad6ef97b93f.jpg",
            ),
        )
}
