package inzynierka.myhotelassistant.utils

import inzynierka.myhotelassistant.models.notification.NotificationEntity
import inzynierka.myhotelassistant.models.notification.NotificationVariant
import inzynierka.myhotelassistant.models.room.RoomEntity
import inzynierka.myhotelassistant.models.schedule.OrderStatus
import inzynierka.myhotelassistant.models.service.RatingEntity
import inzynierka.myhotelassistant.models.service.ServiceEntity
import inzynierka.myhotelassistant.models.service.ServiceType
import inzynierka.myhotelassistant.models.service.WeekdayHour
import inzynierka.myhotelassistant.models.user.*
import inzynierka.myhotelassistant.repositories.NotificationRepository
import inzynierka.myhotelassistant.repositories.RatingRepository
import inzynierka.myhotelassistant.repositories.RoomRepository
import inzynierka.myhotelassistant.repositories.ScheduleRepository
import inzynierka.myhotelassistant.repositories.UserRepository
import inzynierka.myhotelassistant.services.ServiceService
import inzynierka.myhotelassistant.services.UserService
import jakarta.annotation.PostConstruct
import org.slf4j.LoggerFactory
import org.springframework.context.annotation.Profile
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Component
import java.time.DayOfWeek
import java.time.Instant
import java.time.LocalDateTime
import java.time.temporal.ChronoUnit
import kotlin.collections.forEach
import kotlin.math.max
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
    private val notificationRepository: NotificationRepository,
    private val scheduleRepository: ScheduleRepository,
    private val userService: UserService,
    private val schedulesGenerator: SchedulesGenerator,
    private val ratingRepository: RatingRepository,
) {
    private val logger = LoggerFactory.getLogger(this::class.java)

    @PostConstruct
    fun addDefaultUserToDatabase() {
        try {
            addTestAdminAndUser()
            addTestRooms()
            addTestEmployees()
            addTestGuests()
            addServices()
            schedulesGenerator.createSchedules()
            addOrders()
            addManager()
            addRatings()
            addTestNotifications()
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
                    role = Role.EMPLOYEE,
                    username = "employee1",
                    password = passwordEncoder.encode("password"),
                    email = "employee1@gmail.com",
                    name = "Joe",
                    surname = "Doe",
                    employeeData = EmployeeData(Department.HOUSEKEEPING, listOf(Sector.SECURITY)),
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
                    employeeData = EmployeeData(Department.RECEPTION, listOf(Sector.SPA_AND_WELLNESS)),
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
                    employeeData = EmployeeData(Department.FOOD_AND_BEVERAGE, listOf(Sector.BREAKFAST, Sector.LUNCH, Sector.DINNER)),
                ),
            )
        }
    }

    private fun addTestGuests() {
        if (!userRepo.existsByUsername("guest1")) {
            userRepo.save(
                UserEntity(
                    role = Role.GUEST,
                    email = "guest1@gmail.com",
                    username = "guest1",
                    password = passwordEncoder.encode("guest1"),
                    name = "Alice",
                    surname = "Johnson",
                    guestData =
                        GuestData(
                            roomNumber = "121",
                            checkInDate = Instant.now().minus(10, ChronoUnit.DAYS),
                            checkOutDate = Instant.now().plus(5, ChronoUnit.DAYS),
                        ),
                ),
            )
        }
        if (!userRepo.existsByUsername("guest2")) {
            userRepo.save(
                UserEntity(
                    role = Role.GUEST,
                    email = "guest2@gmail.com",
                    username = "guest2",
                    password = passwordEncoder.encode("guest2"),
                    name = "Bob",
                    surname = "Smith",
                    guestData =
                        GuestData(
                            roomNumber = "002",
                            checkInDate = Instant.now().minus(17, ChronoUnit.DAYS),
                            checkOutDate = Instant.now().plus(10, ChronoUnit.DAYS),
                        ),
                ),
            )
        }
        if (!userRepo.existsByUsername("guest3")) {
            userRepo.save(
                UserEntity(
                    role = Role.GUEST,
                    email = "guest3@gmail.com",
                    username = "guest3",
                    password = passwordEncoder.encode("guest3"),
                    name = "Charlie",
                    surname = "Brown",
                    guestData =
                        GuestData(
                            roomNumber = "316",
                            checkInDate = Instant.now().minus(12, ChronoUnit.DAYS),
                            checkOutDate = Instant.now().plus(3, ChronoUnit.DAYS),
                        ),
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
                            val startHour = random.nextInt(6, 14)
                            WeekdayHour(
                                day = day,
                                startHour = startHour,
                                endHour = startHour + random.nextInt(4, 10),
                            )
                        }.toMutableList()

                val service =
                    ServiceEntity(
                        name = serviceData.name,
                        description = serviceData.description,
                        price = (5 + random.nextDouble(5.0, 50.0)).let { (it * 100).roundToInt() / 100.0 },
                        type = serviceData.serviceType,
                        disabled = false,
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

    fun addOrders() {
        val schedules = scheduleRepository.findAll()
        val guests = userService.findByRole(Role.GUEST)
        if (schedules.isEmpty() || guests.isEmpty()) return

        val now = LocalDateTime.now()
        val requestedStatuses = listOf(OrderStatus.REQUESTED, OrderStatus.ACTIVE)
        val pastStatuses = listOf(OrderStatus.COMPLETED, OrderStatus.CANCELED)

        val availableSchedules = schedules.filter { it.guestId == null }
        val pastSchedules = availableSchedules.filter { it.serviceDate.isBefore(now) }.shuffled().toMutableList()
        val futureSchedules = availableSchedules.filter { !it.serviceDate.isBefore(now) }.shuffled().toMutableList()

        for (guest in guests) {
            if (pastSchedules.isEmpty() && futureSchedules.isEmpty()) break

            val requestedCount = if (futureSchedules.isEmpty()) 0 else Random.nextInt(15, 30)
            var schedules = futureSchedules.takeLast(requestedCount)
            futureSchedules.subList(max(0, schedules.size - requestedCount), schedules.size).clear()

            schedules.forEach { schedule ->
                schedule.status = requestedStatuses.random()
                schedule.guestId = guest.id
                schedule.orderTime = now.minusHours(Random.nextLong(1, 48))
                val service = serviceService.findByIdOrThrow(schedule.serviceId)
                schedule.price = service.price
                guest.guestData?.let { data -> data.bill += schedule.price!! }
                scheduleRepository.save(schedule)
            }

            val pastCount = if (pastSchedules.isEmpty()) 0 else Random.nextInt(10, 20)
            schedules = pastSchedules.takeLast(pastCount)
            pastSchedules.subList(max(0, pastSchedules.size - pastCount), pastSchedules.size).clear()

            schedules.forEach { schedule ->
                schedule.status = pastStatuses.random()
                schedule.guestId = guest.id
                schedule.orderTime = schedule.serviceDate.minusHours(Random.nextLong(1, 48))
                val service = serviceService.findByIdOrThrow(schedule.serviceId)
                schedule.price = service.price
                if (schedule.status == OrderStatus.COMPLETED) {
                    guest.guestData?.let { data -> data.bill += schedule.price!! }
                }
                scheduleRepository.save(schedule)
            }

            userService.save(guest)
        }
    }

    private fun addRatings() {
        val currentTime: Long = System.currentTimeMillis()
        val random = Random(currentTime)
        val pastStatuses = listOf(OrderStatus.COMPLETED, OrderStatus.CANCELED)
        val schedules = scheduleRepository.findAllByStatusIn(pastStatuses)
        val ratings =
            schedules
                .filter { it.guestId != null } // for only ordered schedules (should have guestId)
                .filter { random.nextInt(0, 5) == 0 } // 20% chance of schedule rating
                .map {
                    RatingEntity(
                        serviceId = it.serviceId,
                        scheduleId = it.id!!,
                        employeeId = it.employeeId,
                        guestId = it.guestId!!,
                        fullName = userService.findById(it.guestId!!)?.let { user -> user.name + " " + user.surname } ?: "Unknown",
                        rating = random.nextInt(1, 5),
                        comment = "Example comment for particular service. Rating generated randomly.",
                    )
                }
        ratingRepository.saveAll(ratings)
    }

    private fun addManager() {
        if (!userRepo.existsByUsername("manager")) {
            userRepo.save(
                UserEntity(
                    role = Role.MANAGER,
                    username = "manager",
                    password = passwordEncoder.encode("password"),
                    email = "manager@gmail.com",
                    name = "Jim",
                    surname = "Brown",
                    employeeData = EmployeeData(Department.MANAGEMENT),

                ),
            )
            logger.info("Default 'manager' added to database")
        }
    }

    private fun addTestNotifications() {
        val user = userRepo.findByUsername("user")
        if (user != null) {
            val userId = user.id!!
            if (notificationRepository.findAllByUserIdOrderByCreatedAtDesc(userId).isNotEmpty()) return
            val notifications =
                listOf(
                    NotificationEntity(
                        userId = userId,
                        title = "Test Alert Notification",
                        variant = NotificationVariant.ALERT,
                        message = "This is a test notification.",
                        isRead = true,
                        createdAt = LocalDateTime.of(2025, 4, 21, 14, 23, 21),
                    ),
                    NotificationEntity(
                        userId = userId,
                        title = "Another Test Failure Notification",
                        variant = NotificationVariant.FAILURE,
                        message = "This is another test notification.",
                        createdAt = LocalDateTime.of(2025, 5, 4, 10, 9, 11),
                    ),
                    NotificationEntity(
                        userId = userId,
                        title = "Reminder",
                        variant = NotificationVariant.NOTICE,
                        message = "Don't forget to check out tomorrow!",
                        isRead = true,
                        createdAt = LocalDateTime.of(2024, 8, 30, 7, 30, 49),
                    ),
                    NotificationEntity(
                        userId = userId,
                        title = "Service Update",
                        variant = NotificationVariant.CONFIRMATION,
                        message = "Your room cleaning service has been scheduled.",
                        createdAt = LocalDateTime.of(2025, 1, 7, 21, 37, 6),
                    ),
                    NotificationEntity(
                        userId = userId,
                        title = "Special Offer",
                        variant = NotificationVariant.ADVERTISEMENT,
                        message = "Enjoy a 20% discount on your next spa session!",
                        createdAt = LocalDateTime.of(2025, 12, 17, 17, 13, 57),
                    ),
                )
            notificationRepository.saveAll(notifications)
            logger.info("Added test notification to user '${user.username}'")
        } else {
            logger.warn("Cannot add test notifications because 'user' was not found.")
        }
    }

    data class ServiceData(
        val name: String,
        val description: String,
        val imageUrl: String,
        val serviceType: ServiceType,
    )

    val serviceDataList =
        listOf(
            ServiceData(
                "Room cleaning",
                "Thorough cleaning of your room, including dusting, vacuuming, and sanitizing surfaces.",
                "https://i.pinimg.com/736x/b0/9b/77/b09b77d8e801fac4a0d2baa99dbff57b.jpg",
                ServiceType.GENERAL_SERVICE,
            ),
            ServiceData(
                "Laundry",
                "Professional washing, drying, and folding of your clothes using eco-friendly detergents.",
                "https://i.pinimg.com/736x/9d/42/6d/9d426da81011154cfa1e7aa01782c1ca.jpg",
                ServiceType.GENERAL_SERVICE,
            ),
            ServiceData(
                "Spa access",
                "Relax in our luxury spa with sauna, jacuzzi, and massage services.",
                "https://i.pinimg.com/736x/9f/88/01/9f880100ad711d2173157e9c9452ec19.jpg",
                ServiceType.PLACE_RESERVATION,
            ),
            ServiceData(
                "Gym session",
                "Access to a fully equipped fitness center with personal trainers available.",
                "https://i.pinimg.com/736x/3f/1b/c7/3f1bc780ba6582314b5e71b7a46efe1e.jpg",
                ServiceType.PLACE_RESERVATION,
            ),
            ServiceData(
                "Airport shuttle",
                "Convenient transport to and from the airport with comfortable seating and AC.",
                "https://i.pinimg.com/736x/69/56/cb/6956cbcb567a3206dd01d2e00848d21a.jpg",
                ServiceType.GENERAL_SERVICE,
            ),
            ServiceData(
                "Breakfast delivery",
                "Enjoy a fresh breakfast delivered straight to your room every morning.",
                "https://i.pinimg.com/736x/4a/d0/c7/4ad0c71087dfaa177127736d6ff65898.jpg",
                ServiceType.GENERAL_SERVICE,
            ),
            ServiceData(
                "City tour",
                "Guided tour of the city's main attractions, history, and local culture.",
                "https://i.pinimg.com/736x/cb/ba/bb/cbbabb1bd63a761bad5fe0db8db7465c.jpg",
                ServiceType.GENERAL_SERVICE,
            ),
            ServiceData(
                "Valet parking",
                "Fast and secure valet parking service available 24/7.",
                "https://i.pinimg.com/736x/4b/4a/a6/4b4aa6644b4e9db0d14d202917b18c1b.jpg",
                ServiceType.GENERAL_SERVICE,
            ),
            ServiceData(
                "Tennis court",
                "Access to our outdoor tennis court, including equipment rental.",
                "https://i.pinimg.com/736x/f4/4c/44/f44c44e8fa684046a1133ad6ef97b93f.jpg",
                ServiceType.PLACE_RESERVATION,
            ),
        )
}
