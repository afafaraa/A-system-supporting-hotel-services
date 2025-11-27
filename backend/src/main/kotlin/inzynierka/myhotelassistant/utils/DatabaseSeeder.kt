package inzynierka.myhotelassistant.utils

import inzynierka.myhotelassistant.models.notification.NotificationEntity
import inzynierka.myhotelassistant.models.notification.NotificationVariant
import inzynierka.myhotelassistant.models.reservation.ReservationEntity
import inzynierka.myhotelassistant.models.reservation.ReservationStatus
import inzynierka.myhotelassistant.models.room.RoomAmenity
import inzynierka.myhotelassistant.models.room.RoomEntity
import inzynierka.myhotelassistant.models.room.RoomStandardEntity
import inzynierka.myhotelassistant.models.room.RoomStatus
import inzynierka.myhotelassistant.models.schedule.CancellationReason
import inzynierka.myhotelassistant.models.schedule.OrderStatus
import inzynierka.myhotelassistant.models.service.RatingEntity
import inzynierka.myhotelassistant.models.service.ReservationsService
import inzynierka.myhotelassistant.models.service.ServiceEntity
import inzynierka.myhotelassistant.models.service.ServiceType
import inzynierka.myhotelassistant.models.service.ServiceTypeAttributes
import inzynierka.myhotelassistant.models.service.WeekdayHour
import inzynierka.myhotelassistant.models.user.Department
import inzynierka.myhotelassistant.models.user.EmployeeData
import inzynierka.myhotelassistant.models.user.Role
import inzynierka.myhotelassistant.models.user.Sector
import inzynierka.myhotelassistant.models.user.UserEntity
import inzynierka.myhotelassistant.repositories.NotificationRepository
import inzynierka.myhotelassistant.repositories.RatingRepository
import inzynierka.myhotelassistant.repositories.RoomRepository
import inzynierka.myhotelassistant.repositories.RoomStandardRepository
import inzynierka.myhotelassistant.repositories.ScheduleRepository
import inzynierka.myhotelassistant.repositories.ServiceRepository
import inzynierka.myhotelassistant.repositories.UserRepository
import inzynierka.myhotelassistant.services.RoomService
import inzynierka.myhotelassistant.services.ServiceService
import jakarta.annotation.PostConstruct
import org.slf4j.LoggerFactory
import org.springframework.context.annotation.Profile
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Component
import java.time.DayOfWeek
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.temporal.ChronoUnit
import kotlin.collections.forEach
import kotlin.jvm.optionals.getOrNull
import kotlin.math.min
import kotlin.random.Random
import kotlin.time.Duration
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
    private val schedulesGenerator: SchedulesGenerator,
    private val ratingRepository: RatingRepository,
    private val reservationsService: ReservationsService,
    roomStandardRepository: RoomStandardRepository,
    private val roomService: RoomService,
    private val serviceRepository: ServiceRepository,
) {
    private val logger = LoggerFactory.getLogger(this::class.java)
    private val standardRoomStandard =
        roomStandardRepository.findByName("Standard") ?: roomStandardRepository.save(
            RoomStandardEntity(
                name = "Standard",
                capacity = 2,
                basePrice = 50.00,
            ),
        )

    private val deluxeRoomStandard =
        roomStandardRepository.findByName("Deluxe") ?: roomStandardRepository.save(
            RoomStandardEntity(
                name = "Deluxe",
                capacity = 3,
                basePrice = 150.00,
            ),
        )

    private val exclusiveRoomStandard =
        roomStandardRepository.findByName("Exclusive") ?: roomStandardRepository.save(
            RoomStandardEntity(
                name = "Exclusive",
                capacity = 5,
                basePrice = 350.00,
            ),
        )

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
            createReservations()
            // addTestRoomStandards()
        } catch (e: Exception) {
            logger.error(e.message, e)
            throw e
        }
    }

    private fun addTestAdminAndUser() {
        if (!userRepo.existsByUsername("user")) {
            val savedGuest =
                userRepo.save(
                    UserEntity(
                        username = "user",
                        password = passwordEncoder.encode("password"),
                        role = Role.GUEST,
                        email = "test_user@user.test",
                        name = "Test",
                        surname = "User",
                        active = true,
                        emailAuthorized = true,
                    ),
                )
            val reservation =
                ReservationEntity(
                    roomNumber = "002",
                    guestId = savedGuest.id!!,
                    guestsCount = 2,
                    checkIn = LocalDate.now(),
                    checkOut = LocalDate.now().plusDays(7),
                    reservationPrice = 129.99 * 7,
                    paid = true,
                    specialRequests = "I would like to have a room with a sea view and working ac, if possible. Thank you!",
                )
            reservation.status = ReservationStatus.CHECKED_IN
            saveReservationAndBindToGuest(savedGuest, reservation)
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
                    active = true,
                    emailAuthorized = true,
                    surname = "Admin",
                ),
            )
            logger.info("Default 'admin' added to database")
        }
    }

    private fun saveReservationAndBindToGuest(
        savedGuest: UserEntity,
        reservation: ReservationEntity,
    ) {
        val savedReservation = reservationsService.save(reservation)
        reservationsService.bindReservationToGuest(savedGuest, savedReservation)
    }

    private fun addTestRooms() {
        if (!roomRepo.existsById("001")) {
            roomRepo.save(
                RoomEntity(
                    number = "001",
                    floor = 0,
                    capacity = 2,
                    pricePerNight = 100.0,
                    roomStatus = RoomStatus.AVAILABLE,
                    standardId = standardRoomStandard.id.toString(),
                    amenities = setOf(RoomAmenity.AIR_CONDITIONING, RoomAmenity.HAIR_DRYER, RoomAmenity.TV, RoomAmenity.WIFI),
                ),
            )
        }
        if (!roomRepo.existsById("002")) {
            roomRepo.save(
                RoomEntity(
                    number = "002",
                    floor = 0,
                    capacity = 3,
                    pricePerNight = 129.99,
                    standardId = deluxeRoomStandard.id.toString(),
                    amenities =
                        setOf(
                            RoomAmenity.AIR_CONDITIONING,
                            RoomAmenity.HAIR_DRYER,
                            RoomAmenity.MINI_BAR,
                            RoomAmenity.TV,
                            RoomAmenity.WIFI,
                            RoomAmenity.PET_FRIENDLY,
                        ),
                ),
            )
        }
        if (!roomRepo.existsById("005")) {
            roomRepo.save(
                RoomEntity(
                    number = "005",
                    floor = 0,
                    capacity = 4,
                    pricePerNight = 380.0,
                    standardId = exclusiveRoomStandard.id.toString(),
                    amenities = setOf(RoomAmenity.HAIR_DRYER, RoomAmenity.TV, RoomAmenity.WIFI),
                ),
            )
        }
        if (!roomRepo.existsById("121")) {
            roomRepo.save(
                RoomEntity(
                    number = "121",
                    floor = 1,
                    capacity = 3,
                    pricePerNight = 210.0,
                    standardId = standardRoomStandard.id.toString(),
                    amenities =
                        setOf(
                            RoomAmenity.AIR_CONDITIONING,
                            RoomAmenity.HAIR_DRYER,
                            RoomAmenity.MINI_BAR,
                            RoomAmenity.TV,
                            RoomAmenity.WIFI,
                            RoomAmenity.SAFE,
                            RoomAmenity.BALCONY,
                            RoomAmenity.PET_FRIENDLY,
                            RoomAmenity.SEA_VIEW,
                        ),
                ),
            )
        }
        if (!roomRepo.existsById("117")) {
            roomRepo.save(
                RoomEntity(
                    number = "117",
                    floor = 1,
                    capacity = 4,
                    pricePerNight = 199.99,
                    standardId = standardRoomStandard.id.toString(),
                    amenities =
                        setOf(
                            RoomAmenity.AIR_CONDITIONING,
                            RoomAmenity.HAIR_DRYER,
                            RoomAmenity.MINI_BAR,
                            RoomAmenity.TV,
                            RoomAmenity.WIFI,
                            RoomAmenity.SAFE,
                        ),
                ),
            )
        }
        if (!roomRepo.existsById("316")) {
            roomRepo.save(
                RoomEntity(
                    number = "316",
                    floor = 3,
                    capacity = 5,
                    pricePerNight = 250.0,
                    standardId = standardRoomStandard.id.toString(),
                    amenities = setOf(RoomAmenity.AIR_CONDITIONING, RoomAmenity.TV, RoomAmenity.WIFI, RoomAmenity.BALCONY),
                    roomStatus = RoomStatus.OUT_OF_SERVICE,
                ),
            )
        }
        if (!roomRepo.existsById("317")) {
            roomRepo.save(
                RoomEntity(
                    number = "317",
                    floor = 3,
                    capacity = 2,
                    pricePerNight = 120.0,
                    standardId = deluxeRoomStandard.id.toString(),
                    amenities = setOf(RoomAmenity.TV, RoomAmenity.WIFI),
                    roomStatus = RoomStatus.AVAILABLE,
                ),
            )
        }
        if (!roomRepo.existsById("319")) {
            roomRepo.save(
                RoomEntity(
                    number = "319",
                    floor = 3,
                    capacity = 3,
                    pricePerNight = 180.0,
                    standardId = deluxeRoomStandard.id.toString(),
                    amenities = setOf(RoomAmenity.AIR_CONDITIONING, RoomAmenity.TV, RoomAmenity.WIFI, RoomAmenity.MINI_BAR),
                    roomStatus = RoomStatus.AVAILABLE,
                ),
            )
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
                    active = true,
                    emailAuthorized = true,
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
                    active = true,
                    emailAuthorized = true,
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
                    active = true,
                    emailAuthorized = true,
                    surname = "Brown",
                    employeeData = EmployeeData(Department.FOOD_AND_BEVERAGE, listOf(Sector.BREAKFAST, Sector.LUNCH, Sector.DINNER)),
                ),
            )
        }
        if (!userRepo.existsByUsername("employee4")) {
            userRepo.save(
                UserEntity(
                    role = Role.EMPLOYEE,
                    username = "employee4",
                    password = passwordEncoder.encode("employee4_password"),
                    email = "d.wilson@gmail.com",
                    name = "David",
                    active = true,
                    emailAuthorized = true,
                    surname = "Wilson",
                    employeeData = EmployeeData(Department.MAINTENANCE, listOf(Sector.SECURITY, Sector.ROOM_SERVICE)),
                ),
            )
        }
    }

    private fun addTestGuests() {
        if (!userRepo.existsByUsername("guest1")) {
            val savedGuest =
                userRepo.save(
                    UserEntity(
                        role = Role.GUEST,
                        email = "guest1@gmail.com",
                        username = "guest1",
                        password = passwordEncoder.encode("guest1"),
                        name = "Alice",
                        active = true,
                        emailAuthorized = true,
                        surname = "Johnson",
                    ),
                )
            val reservation =
                ReservationEntity(
                    roomNumber = "121",
                    guestId = savedGuest.id!!,
                    guestsCount = 3,
                    checkIn = LocalDate.now().minusDays(10),
                    checkOut = LocalDate.now().plusDays(5),
                    reservationPrice = 210.0 * 15,
                    paid = true,
                )
            reservation.status = ReservationStatus.CHECKED_IN
            saveReservationAndBindToGuest(savedGuest, reservation)
        }
        if (!userRepo.existsByUsername("guest2")) {
            val savedGuest =
                userRepo.save(
                    UserEntity(
                        role = Role.GUEST,
                        email = "guest2@gmail.com",
                        username = "guest2",
                        password = passwordEncoder.encode("guest2"),
                        name = "Bob",
                        surname = "Smith",
                        active = true,
                        emailAuthorized = true,
                    ),
                )
            val reservation =
                ReservationEntity(
                    roomNumber = "002",
                    guestId = savedGuest.id!!,
                    guestsCount = 2,
                    checkIn = LocalDate.now().minusDays(17),
                    checkOut = LocalDate.now().plusDays(10),
                    reservationPrice = 129.99 * 27,
                    paid = true,
                )
            reservation.status = ReservationStatus.CHECKED_IN
            saveReservationAndBindToGuest(savedGuest, reservation)
        }
        if (!userRepo.existsByUsername("guest3")) {
            val savedGuest =
                userRepo.save(
                    UserEntity(
                        role = Role.GUEST,
                        email = "guest3@gmail.com",
                        username = "guest3",
                        password = passwordEncoder.encode("guest3"),
                        name = "Charlie",
                        surname = "Brown",
                        active = true,
                        emailAuthorized = true,
                    ),
                )
            val reservation =
                ReservationEntity(
                    roomNumber = "316",
                    guestId = savedGuest.id!!,
                    guestsCount = 4,
                    checkIn = LocalDate.now().minusDays(12),
                    checkOut = LocalDate.now().plusDays(3),
                    reservationPrice = 250.0 * 15,
                    paid = true,
                )
            reservation.status = ReservationStatus.CHECKED_IN
            saveReservationAndBindToGuest(savedGuest, reservation)
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
                                endHour = startHour + random.nextInt(6, 10),
                            )
                        }.toMutableList()

                val service =
                    ServiceEntity(
                        name = serviceData.name,
                        description = serviceData.description,
                        price = serviceData.price,
                        type = serviceData.serviceType,
                        attributes = serviceData.attributes,
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

    private fun <T> MutableSet<T>.popRandom(n: Int): List<T> {
        val result = mutableListOf<T>()
        repeat(min(n, this.size)) {
            val element = this.random()
            this.remove(element)
            result += element
        }
        return result
    }

    data class DurationAndPrice(
        val duration: Duration,
        val price: Double,
    )

    fun addOrders() {
        val schedulesCount = scheduleRepository.count()
        val schedules =
            scheduleRepository
                .findAllByStatusIn(listOf(OrderStatus.AVAILABLE))
                .filter { it.guestId == null } // just in case
        if (schedulesCount != schedules.size.toLong()) {
            logger.info("Some orders already exists. Skipping adding new orders.")
            return
        }
        val guests = userRepo.findByRole(Role.GUEST)
        if (schedules.isEmpty() || guests.isEmpty()) return
        val services = serviceRepository.findAll()
        val serviceDetails = services.associate { it.id to DurationAndPrice(it.duration, it.price) }

        val now = LocalDateTime.now()
        val requestedStatuses = listOf(OrderStatus.REQUESTED, OrderStatus.ACTIVE)
        val pastStatuses = listOf(OrderStatus.COMPLETED, OrderStatus.CANCELED)

        val pastSchedules =
            schedules
                .filter {
                    val serviceDuration = serviceDetails[it.serviceId]?.duration?.inWholeMinutes ?: 0L
                    val serviceEndDate = it.serviceDate.plusMinutes(serviceDuration)
                    serviceEndDate.isBefore(now)
                }.toMutableSet()
        val futureSchedules = schedules.filter { !pastSchedules.contains(it) }.toMutableSet()

        for (guest in guests) {
            if (pastSchedules.isEmpty() && futureSchedules.isEmpty()) break

            val futureSchedulesFragment = futureSchedules.popRandom(Random.nextInt(15, 30))
            futureSchedulesFragment.forEach { schedule ->
                schedule.status = requestedStatuses.random()
                schedule.guestId = guest.id
                schedule.orderTime = now.minusHours(Random.nextLong(1, 48))
                val servicePrice = serviceDetails[schedule.serviceId]?.price ?: 0.0
                schedule.price = if (servicePrice >= 0.01) servicePrice else ((70..300).random() / 10.0)
                if (Random.nextInt(0, 10) < 2) {
                    schedule.specialRequests = "Example special request for particular service. Request generated randomly."
                }
                guest.guestData?.addServiceToBill(schedule.id!!, schedule.price!!, schedule.orderTime!!)
            }
            scheduleRepository.saveAll(futureSchedulesFragment)

            val pastSchedulesFragment = pastSchedules.popRandom(Random.nextInt(10, 20))
            pastSchedulesFragment.forEach { schedule ->
                schedule.status = pastStatuses.random()
                schedule.guestId = guest.id
                schedule.orderTime = schedule.serviceDate.minusHours(Random.nextLong(1, 48))
                val servicePrice = serviceDetails[schedule.serviceId]?.price ?: 0.0
                schedule.price = if (servicePrice >= 0.01) servicePrice else ((70..300).random() / 10.0)
                if (schedule.status == OrderStatus.COMPLETED) {
                    guest.guestData?.addServiceToBill(schedule.id!!, schedule.price!!, schedule.orderTime!!)
                } else if (schedule.status == OrderStatus.CANCELED) {
                    schedule.cancellationReason = CancellationReason.entries.random()
                }
            }
            scheduleRepository.saveAll(pastSchedulesFragment)

            userRepo.save(guest)
        }
    }

    private fun addRatings() {
        if (ratingRepository.count() != 0L) {
            logger.info("Some ratings were already added to the database. Skipping adding ratings.")
            return
        }
        val ratingWeights = listOf(1, 2, 2, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5)
        val currentTime: Long = System.currentTimeMillis()
        val random = Random(currentTime)
        val pastStatuses = listOf(OrderStatus.COMPLETED, OrderStatus.CANCELED)
        val schedules = scheduleRepository.findAllByStatusIn(pastStatuses)
        val ratings =
            schedules
                .filter { it.guestId != null } // for only ordered schedules (should have guestId)
                .filter { random.nextInt(0, 10) < 4 } // 40% chance of schedule rating
                .map {
                    RatingEntity(
                        serviceId = it.serviceId,
                        scheduleId = it.id!!,
                        employeeId = it.employeeId,
                        guestId = it.guestId!!,
                        fullName = userRepo.findById(it.guestId!!).getOrNull()?.let { user -> user.name + " " + user.surname } ?: "Unknown",
                        rating = ratingWeights.random(),
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
                    active = true,
                    emailAuthorized = true,
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
                        createdAt = LocalDateTime.now(),
                    ),
                    NotificationEntity(
                        userId = userId,
                        title = "Another Test Failure Notification",
                        variant = NotificationVariant.FAILURE,
                        message = "This is another test notification.",
                        createdAt = LocalDateTime.now(),
                    ),
                    NotificationEntity(
                        userId = userId,
                        title = "Reminder",
                        variant = NotificationVariant.NOTICE,
                        message = "Don't forget to check out tomorrow!",
                        isRead = true,
                        createdAt = LocalDateTime.now(),
                    ),
                    NotificationEntity(
                        userId = userId,
                        title = "Service Update",
                        variant = NotificationVariant.CONFIRMATION,
                        message = "Your room cleaning service has been scheduled.",
                        createdAt = LocalDateTime.now(),
                    ),
                    NotificationEntity(
                        userId = userId,
                        title = "Special Offer",
                        variant = NotificationVariant.ADVERTISEMENT,
                        message = "Enjoy a 20% discount on your next spa session!",
                        createdAt = LocalDateTime.now(),
                    ),
                )
            notificationRepository.saveAll(notifications)
            logger.info("Added test notification to user '${user.username}'")
        } else {
            logger.warn("Cannot add test notifications because 'user' was not found.")
        }
    }

    private fun createReservations() {
        val guests = userRepo.findByRole(Role.GUEST)
        if (reservationsService.count() > guests.size.toLong()) {
            logger.info("Some reservations already exists. Skipping adding new reservations")
            return
        }
        val rooms = roomRepo.findAll()
        val now = LocalDate.now()
        repeat(4) {
            guests.forEach { guest ->
                val checkIn = now.plusDays(Random.nextInt(-4, 2).toLong())
                val checkOut = checkIn.plusDays(Random.nextInt(1, 4).toLong())
                val room = rooms.shuffled().find { room -> reservationsService.isRoomAvailable(room.number, checkIn, checkOut) }
                if (room != null) {
                    val standard = roomService.findStandardById(room.standardId)
                    val reservation =
                        ReservationEntity(
                            roomNumber = room.number,
                            guestId = guest.id!!,
                            guestsCount = Random.nextInt(1, room.capacity + 1),
                            checkIn = checkIn,
                            checkOut = checkOut,
                            reservationPrice = (room.pricePerNight ?: standard.basePrice).times(ChronoUnit.DAYS.between(checkIn, checkOut)),
                        )
                    reservation.status =
                        if (checkOut.isBefore(now)) {
                            listOf(ReservationStatus.COMPLETED, ReservationStatus.CANCELED, ReservationStatus.REJECTED).random()
                        } else {
                            listOf(ReservationStatus.REQUESTED, ReservationStatus.CONFIRMED, ReservationStatus.CHECKED_IN).random()
                        }
                    val savedReservation = reservationsService.save(reservation)
                    guest.guestData?.addReservationToBill(savedReservation.id!!, savedReservation.reservationPrice)
                    logger.info("Placed reservation for guest '${guest.username}' in room '${room.number}'")
                } else {
                    logger.warn(
                        "Cannot place reservation for guest '${guest.username}' because there wasn't any available room.",
                    )
                }
            }
        }
    }

    data class ServiceData(
        val name: String,
        val description: String,
        val imageUrl: String,
        val serviceType: ServiceType,
        val price: Double = 0.0,
        val attributes: ServiceTypeAttributes? = null,
    )

    val serviceDataList =
        listOf(
            ServiceData(
                "Food delivery from menu",
                "Order delicious meals and beverages from our extensive menu, delivered straight to your room.",
                "https://i.pinimg.com/1200x/b5/1e/c0/b51ec055f32d175f1c1ae0db5cdaf4d0.jpg",
                ServiceType.SELECTION,
                price = 0.0,
                attributes =
                    ServiceTypeAttributes.Selection(
                        multipleSelection = true,
                        options =
                            linkedMapOf(
                                "soups" to
                                    listOf(
                                        ServiceTypeAttributes.OptionObject(
                                            label = "Tomato Soup",
                                            description = "Fresh tomatoes blended into a creamy soup.",
                                            price = 5.99,
                                            image = "https://i.pinimg.com/1200x/dc/88/5e/dc885e424e2cc36080e3ffaee09b6dfb.jpg",
                                        ),
                                        ServiceTypeAttributes.OptionObject(
                                            label = "Chicken Noodle Soup",
                                            description = "Hearty chicken broth with noodles and vegetables.",
                                            price = 6.99,
                                            image = "https://i.pinimg.com/1200x/22/80/7c/22807cd7d1f29e5894b5ca68a557a8c1.jpg",
                                        ),
                                    ),
                                "main_courses" to
                                    listOf(
                                        ServiceTypeAttributes.OptionObject(
                                            label = "Grilled Salmon",
                                            description = "Fresh salmon fillet grilled to perfection, served with vegetables.",
                                            price = 15.99,
                                            image = "https://i.pinimg.com/1200x/a8/ac/21/a8ac21fd838e87e55e23589a826ecfff.jpg",
                                        ),
                                        ServiceTypeAttributes.OptionObject(
                                            label = "Steak",
                                            description = "Juicy steak cooked to your liking, served with fries and salad.",
                                            price = 18.99,
                                            image = "https://i.pinimg.com/736x/fa/74/a1/fa74a1051787c3d9ce707215be6eedd8.jpg",
                                        ),
                                    ),
                                "desserts" to
                                    listOf(
                                        ServiceTypeAttributes.OptionObject(
                                            label = "Cheesecake",
                                            description = "Creamy cheesecake with a graham cracker crust.",
                                            price = 6.49,
                                            image = "https://i.pinimg.com/736x/93/09/62/930962eed0b30e9e861d5e097dfdfd14.jpg",
                                        ),
                                        ServiceTypeAttributes.OptionObject(
                                            label = "Chocolate Lava Cake",
                                            description = "Warm chocolate cake with a gooey center, served with vanilla ice cream.",
                                            price = 6.99,
                                            image = "https://i.pinimg.com/736x/ef/bc/8e/efbc8e27d543d6fa0c0559967c104896.jpg",
                                        ),
                                    ),
                            ),
                    ),
            ),
            ServiceData(
                "Room cleaning",
                "Thorough cleaning of your room, including dusting, vacuuming, and sanitizing surfaces.",
                "https://i.pinimg.com/736x/b0/9b/77/b09b77d8e801fac4a0d2baa99dbff57b.jpg",
                ServiceType.GENERAL_SERVICE,
                price = 11.90,
            ),
            ServiceData(
                "Laundry",
                "Professional washing, drying, and folding of your clothes using eco-friendly detergents.",
                "https://i.pinimg.com/736x/9d/42/6d/9d426da81011154cfa1e7aa01782c1ca.jpg",
                ServiceType.GENERAL_SERVICE,
                price = 10.0,
            ),
            ServiceData(
                "Spa access",
                "Relax in our luxury spa with sauna, jacuzzi, and massage services.",
                "https://i.pinimg.com/736x/9f/88/01/9f880100ad711d2173157e9c9452ec19.jpg",
                ServiceType.PLACE_RESERVATION,
                price = 42.50,
            ),
            ServiceData(
                "Gym session",
                "Access to a fully equipped fitness center with personal trainers available.",
                "https://i.pinimg.com/736x/3f/1b/c7/3f1bc780ba6582314b5e71b7a46efe1e.jpg",
                ServiceType.PLACE_RESERVATION,
                price = 25.0,
            ),
            ServiceData(
                "Airport shuttle",
                "Convenient transport to and from the airport with comfortable seating and AC.",
                "https://i.pinimg.com/736x/69/56/cb/6956cbcb567a3206dd01d2e00848d21a.jpg",
                ServiceType.GENERAL_SERVICE,
                price = 15.0,
            ),
            ServiceData(
                "Breakfast delivery",
                "Enjoy a fresh breakfast delivered straight to your room every morning.",
                "https://i.pinimg.com/736x/4a/d0/c7/4ad0c71087dfaa177127736d6ff65898.jpg",
                ServiceType.GENERAL_SERVICE,
                price = 15.0,
            ),
            ServiceData(
                "City tour",
                "Guided tour of the city's main attractions, history, and local culture.",
                "https://i.pinimg.com/736x/cb/ba/bb/cbbabb1bd63a761bad5fe0db8db7465c.jpg",
                ServiceType.GENERAL_SERVICE,
                price = 80.0,
            ),
            ServiceData(
                "Valet parking",
                "Fast and secure valet parking service available 24/7.",
                "https://i.pinimg.com/736x/4b/4a/a6/4b4aa6644b4e9db0d14d202917b18c1b.jpg",
                ServiceType.GENERAL_SERVICE,
                price = 5.0,
            ),
            ServiceData(
                "Tennis court",
                "Access to our outdoor tennis court, including equipment rental.",
                "https://i.pinimg.com/736x/f4/4c/44/f44c44e8fa684046a1133ad6ef97b93f.jpg",
                ServiceType.PLACE_RESERVATION,
                price = 12.0,
            ),
        )
}
