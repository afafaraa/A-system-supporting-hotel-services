package inzynierka.myhotelassistant.repositories

import inzynierka.myhotelassistant.models.reservation.ReservationEntity
import inzynierka.myhotelassistant.models.service.ReservationsService
import org.junit.jupiter.api.AfterAll
import org.junit.jupiter.api.BeforeAll
import org.junit.jupiter.api.TestInstance
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.ActiveProfiles
import org.springframework.test.context.DynamicPropertyRegistry
import org.springframework.test.context.DynamicPropertySource
import org.testcontainers.containers.MongoDBContainer
import org.testcontainers.junit.jupiter.Container
import java.time.LocalDate
import kotlin.test.Test
import kotlin.test.assertFalse
import kotlin.test.assertTrue

@SpringBootTest
@ActiveProfiles("test")
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class ReservationsServiceTest {
    companion object {
        @Container
        @JvmStatic
        val mongoDBContainer = MongoDBContainer("mongo:8")

        @JvmStatic
        @DynamicPropertySource
        fun mongoProperties(registry: DynamicPropertyRegistry) {
            mongoDBContainer.start()
            registry.add("spring.data.mongodb.uri", mongoDBContainer::getReplicaSetUrl)
        }

        @AfterAll
        @JvmStatic
        fun teardown() {
            mongoDBContainer.stop()
        }
    }

    @Autowired
    private lateinit var reservationsService: ReservationsService

    @Autowired
    private lateinit var reservationsRepository: ReservationsRepository

    @BeforeAll
    fun setup() {
        reservationsRepository.save(
            ReservationEntity(
                roomNumber = "room123",
                guestId = "guest1",
                checkIn = LocalDate.of(2025, 9, 24),
                checkOut = LocalDate.of(2025, 9, 27),
                reservationPrice = 300.0,
                guestsCount = 3,
            ),
        )
    }

    @Test
    fun `should assert false when checkOut is in the reservation's time interval`() {
        assertFalse {
            reservationsService.isRoomAvailable(
                roomNumber = "room123",
                from = LocalDate.of(2025, 9, 22),
                to = LocalDate.of(2025, 9, 25),
            )
        }
    }

    @Test
    fun `should assert false when checkIn is in the reservation's time interval`() {
        assertFalse {
            reservationsService.isRoomAvailable(
                roomNumber = "room123",
                from = LocalDate.of(2025, 9, 25),
                to = LocalDate.of(2025, 9, 30),
            )
        }
    }

    @Test
    fun `should assert false when checkIn is before and checkOut is after the reservation's time interval`() {
        assertFalse {
            reservationsService.isRoomAvailable(
                roomNumber = "room123",
                from = LocalDate.of(2025, 9, 20),
                to = LocalDate.of(2025, 9, 30),
            )
        }
    }

    @Test
    fun `should assert false when checkOut and CheckIn is in the reservation's time interval`() {
        assertFalse {
            reservationsService.isRoomAvailable(
                roomNumber = "room123",
                from = LocalDate.of(2025, 9, 24),
                to = LocalDate.of(2025, 9, 27),
            )
        }
        assertFalse {
            reservationsService.isRoomAvailable(
                roomNumber = "room123",
                from = LocalDate.of(2025, 9, 25),
                to = LocalDate.of(2025, 9, 27),
            )
        }
        assertFalse {
            reservationsService.isRoomAvailable(
                roomNumber = "room123",
                from = LocalDate.of(2025, 9, 24),
                to = LocalDate.of(2025, 9, 26),
            )
        }
        assertFalse {
            reservationsService.isRoomAvailable(
                roomNumber = "room123",
                from = LocalDate.of(2025, 9, 25),
                to = LocalDate.of(2025, 9, 26),
            )
        }
    }

    @Test
    fun `should assert true when checkIn is the reservation's checkOut date`() {
        assertTrue {
            reservationsService.isRoomAvailable(
                roomNumber = "room123",
                from = LocalDate.of(2025, 9, 27),
                to = LocalDate.of(2025, 9, 30),
            )
        }
    }

    @Test
    fun `should assert true when checkOut is the reservation's checkIn date`() {
        assertTrue {
            reservationsService.isRoomAvailable(
                roomNumber = "room123",
                from = LocalDate.of(2025, 9, 21),
                to = LocalDate.of(2025, 9, 24),
            )
        }
    }

    @Test
    fun `should assert true when checkIn and checkOut isn't in the reservation's time interval`() {
        assertTrue {
            reservationsService.isRoomAvailable(
                roomNumber = "room123",
                from = LocalDate.of(2025, 9, 28),
                to = LocalDate.of(2025, 9, 29),
            )
        }
        assertTrue {
            reservationsService.isRoomAvailable(
                roomNumber = "room123",
                from = LocalDate.of(2025, 9, 20),
                to = LocalDate.of(2025, 9, 21),
            )
        }
    }
}
