package inzynierka.myhotelassistant.utils

import inzynierka.myhotelassistant.models.notification.NotificationEntity
import inzynierka.myhotelassistant.models.room.RoomEntity
import inzynierka.myhotelassistant.models.schedule.OrderStatus
import inzynierka.myhotelassistant.models.schedule.ScheduleEntity
import inzynierka.myhotelassistant.models.service.Rating
import inzynierka.myhotelassistant.models.service.ServiceEntity
import inzynierka.myhotelassistant.models.service.ServiceType
import inzynierka.myhotelassistant.models.service.WeekdayHour
import inzynierka.myhotelassistant.models.user.GuestData
import inzynierka.myhotelassistant.models.user.Role
import inzynierka.myhotelassistant.models.user.UserEntity
import inzynierka.myhotelassistant.repositories.NotificationRepository
import inzynierka.myhotelassistant.repositories.RoomRepository
import inzynierka.myhotelassistant.repositories.ScheduleRepository
import inzynierka.myhotelassistant.repositories.UserRepository
import inzynierka.myhotelassistant.services.EmployeeService
import inzynierka.myhotelassistant.services.ScheduleService
import inzynierka.myhotelassistant.services.ServiceService
import inzynierka.myhotelassistant.services.UserService
import jakarta.annotation.PostConstruct
import org.slf4j.LoggerFactory
import org.springframework.context.annotation.Profile
import org.springframework.data.domain.Pageable
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Component
import java.time.DayOfWeek
import java.time.Instant
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.LocalTime
import java.time.temporal.ChronoUnit
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
    private val notificationRepository: NotificationRepository,
    private val scheduleRepository: ScheduleRepository,
    private val employeeService: EmployeeService,
    private val userService: UserService,
    private val scheduleService: ScheduleService,
) {
    private val logger = LoggerFactory.getLogger(DatabaseSeeder::class.java)

    @PostConstruct
    fun addDefaultUserToDatabase() {
        try {
            addTestAdminAndUser()
            addTestRooms()
            addTestEmployees()
            addServices()
            addSchedule()
            addOrders()
            addManager()
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
        val user = userService.findByRole(Role.GUEST)
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
                        type = serviceData.serviceType,
                        disabled = false,
                        rating =
                            List(random.nextInt(1, 3)) {
                                Rating(user?.get(0)?.name!! + " " + user.get(0).surname, random.nextInt(1, 5), "comment")
                            }.toMutableList(),
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

    fun addSchedule() {
        val services = serviceService.findAll()
        val allEmployees = employeeService.getAllEmployees(Pageable.unpaged())
        val schedule = scheduleRepository.findAll()
        if (!schedule.isEmpty()) {
            return
        }

        val employeeAvailability: MutableMap<String, MutableList<Pair<LocalDateTime, LocalDateTime>>> = mutableMapOf()
        allEmployees.forEach { employee ->
            employeeAvailability[employee.id!!] = mutableListOf()
        }

        val today = LocalDate.now()
        val startDate = today.minusWeeks(2)
        val endDate = today.plusWeeks(3)

        var currentDate = startDate
        while (!currentDate.isAfter(endDate)) {
            val numberOfServicesToday = Random.nextInt(5, 10) // 2 to 6 services a day

            for (service in services) {
                for (i in 0 until numberOfServicesToday) {
                    val availableWeekdayHours = service.weekday.filter { it.day == currentDate.dayOfWeek }

                    if (availableWeekdayHours.isNotEmpty()) {
                        val randomWeekdayHour = availableWeekdayHours.random()
                        val serviceDurationMinutes = service.duration.inWholeMinutes

                        var assigned = false
                        val possibleStartTimes =
                            (randomWeekdayHour.startHour..randomWeekdayHour.endHour)
                                .flatMap { hour ->
                                    listOf(
                                        LocalTime.of(hour, 0),
                                        LocalTime.of(hour, 15),
                                        LocalTime.of(hour, 30),
                                        LocalTime.of(hour, 45),
                                    )
                                }.filter { it.plusMinutes(serviceDurationMinutes).isBefore(LocalTime.of(randomWeekdayHour.endHour, 59)) }
                                .shuffled()

                        for (potentialStartTime in possibleStartTimes) {
                            val proposedDateTime = currentDate.atTime(potentialStartTime)
                            val serviceEndTime = proposedDateTime.plusMinutes(serviceDurationMinutes)
                            val breakEndTime = serviceEndTime.plusMinutes(15) // 15 min break

                            val availableEmployeesForService =
                                allEmployees.shuffled().filter { employee ->
                                    val employeeId = employee.id!!
                                    val occupiedSlots = employeeAvailability[employeeId] ?: mutableListOf()

                                    val hasOverlap =
                                        occupiedSlots.any { (slotStart, slotEnd) ->
                                            (proposedDateTime.isBefore(slotEnd) && serviceEndTime.isAfter(slotStart))
                                        }
                                    !hasOverlap
                                }

                            if (availableEmployeesForService.isNotEmpty()) {
                                val chosenEmployee = availableEmployeesForService.first()

                                val scheduleEntity =
                                    ScheduleEntity(
                                        serviceId = service.id!!,
                                        serviceDate = proposedDateTime,
                                        weekday = currentDate.dayOfWeek,
                                        employeeId = chosenEmployee.id,
                                        isOrdered = false,
                                        guestId = null,
                                    )

                                employeeAvailability[chosenEmployee.id!!]?.add(Pair(proposedDateTime, breakEndTime))
                                employeeAvailability[chosenEmployee.id!!]?.sortBy { it.first } // Keep sorted

                                scheduleRepository.save(scheduleEntity)
                                logger.info(
                                    "Schedule added: ${service.name} on $currentDate at $proposedDateTime with Employee ${chosenEmployee.id}",
                                )
                                assigned = true
                                break
                            }
                        }
                        if (!assigned) {
                            logger.warn("Could not find a suitable time and employee for service ${service.name} on $currentDate")
                        }
                    }
                }
            }
            currentDate = currentDate.plusDays(1)
        }
    }

    fun addOrders() {
        val scheduleList = scheduleRepository.findAll().toMutableList()
        val guests = userService.findByRole(Role.GUEST)

        if (scheduleList.isEmpty() || guests?.isEmpty() == true) return

        val now = LocalDateTime.now()

        guests?.forEach { guest ->
            val availableSchedules = scheduleList.filter { it.guestId == null }.shuffled()

            if (availableSchedules.isEmpty()) return@forEach

            val requestedCount = Random.nextInt(3, 6)
            val pastCount = Random.nextInt(10, 16)

            val requestedStatuses = listOf(OrderStatus.PENDING, OrderStatus.IN_PROGRESS)
            val pastStatuses = listOf(OrderStatus.FINISHED, OrderStatus.CANCELED)

            val totalCount = requestedCount + pastCount
            val schedulesToUpdate = availableSchedules.take(totalCount)

            schedulesToUpdate.take(pastCount).forEach { schedule ->
                if (schedule.serviceDate.isAfter(now)) {
                    schedule.serviceDate = now.minusDays(Random.nextLong(1, 15))
                }
                schedule.status = pastStatuses.random()
                schedule.isOrdered = true
                schedule.guestId = guest.id
                schedule.orderTime = schedule.serviceDate.minusHours(Random.nextLong(1, 48))
                if (schedule.status == OrderStatus.FINISHED) {
                    val service = serviceService.findByIdOrThrow(schedule.serviceId)
                    guest.guestData?.let { data ->
                        data.bill += service.price
                    }
                }

                scheduleRepository.save(schedule)
            }

            schedulesToUpdate.drop(pastCount).forEach { schedule ->
                if (schedule.serviceDate.isBefore(now)) {
                    schedule.serviceDate = now.plusDays(Random.nextLong(1, 15))
                }
                schedule.status = requestedStatuses.random()
                schedule.isOrdered = true
                schedule.guestId = guest.id
                schedule.orderTime = now.minusHours(Random.nextLong(1, 48))
                val service = serviceService.findByIdOrThrow(schedule.serviceId)
                guest.guestData?.let { data ->
                    data.bill += service.price
                }
                scheduleRepository.save(schedule)
            }
            userService.save(guest)
        }
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
                        title = "Test Notification",
                        message = "This is a test notification.",
                        isRead = true,
                        createdAt = LocalDateTime.of(2025, 4, 21, 14, 23, 21),
                    ),
                    NotificationEntity(
                        userId = userId,
                        title = "Another Test Notification",
                        message = "This is another test notification.",
                        createdAt = LocalDateTime.of(2025, 5, 4, 10, 9, 11),
                    ),
                    NotificationEntity(
                        userId = userId,
                        title = "Reminder",
                        message = "Don't forget to check out tomorrow!",
                        isRead = true,
                        createdAt = LocalDateTime.of(2024, 8, 30, 7, 30, 49),
                    ),
                    NotificationEntity(
                        userId = userId,
                        title = "Service Update",
                        message = "Your room cleaning service has been scheduled.",
                        createdAt = LocalDateTime.of(2025, 1, 7, 21, 37, 6),
                    ),
                    NotificationEntity(
                        userId = userId,
                        title = "Special Offer",
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
