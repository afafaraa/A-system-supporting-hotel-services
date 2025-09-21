package inzynierka.myhotelassistant.services

import inzynierka.myhotelassistant.models.schedule.OrderStatus
import inzynierka.myhotelassistant.models.stats.DailySales
import inzynierka.myhotelassistant.models.stats.ServiceStat
import inzynierka.myhotelassistant.models.stats.StatsResponse
import inzynierka.myhotelassistant.models.user.Role
import inzynierka.myhotelassistant.repositories.ScheduleRepository
import inzynierka.myhotelassistant.repositories.ServiceRepository
import inzynierka.myhotelassistant.repositories.UserRepository
import org.springframework.stereotype.Service
import java.time.LocalDate
import java.time.ZoneId
import java.time.format.DateTimeFormatter
import kotlin.math.roundToLong

@Service
class StatsService(
    private val scheduleRepository: ScheduleRepository,
    private val serviceRepository: ServiceRepository,
    private val userRepository: UserRepository,
) {
    data class ServiceStat(
        val id: Int,
        val name: String,
        val orderCount: Int? = null,
        val revenue: String? = null,
    )

    fun getStats(): List<ServiceStat> {
        val allOrders =
            scheduleRepository
                .findAll()
                .filter { it.status != OrderStatus.CANCELED }

        val allGuests =
            userRepository
                .findAll()
                .filter { it.role == Role.GUEST && it.guestData != null }

        val today = LocalDate.now()
        val bookingsToday = allOrders.count { it.serviceDate.toLocalDate() == today }

        val checkIns = allGuests.count {
            val checkIn = it.guestData!!.checkInDate.atZone(ZoneId.systemDefault()).toLocalDate()
            checkIn == today
        }

        val totalGuests = allGuests.count {
            val guestData = it.guestData!!
            val checkIn = guestData.checkInDate.atZone(ZoneId.systemDefault()).toLocalDate()
            val checkOut = guestData.checkOutDate.atZone(ZoneId.systemDefault()).toLocalDate()
            !today.isBefore(checkIn) && !today.isAfter(checkOut)
        }

        val totalRevenue = allOrders.sumOf { order ->
            serviceRepository.findById(order.serviceId).map { it.price }.orElse(0.0)
        }

        return listOf(
            ServiceStat(id = 1, name = "bookings_today", orderCount = bookingsToday),
            ServiceStat(id = 2, name = "check_ins", orderCount = checkIns),
            ServiceStat(id = 3, name = "revenue", revenue = String.format("%.2f", totalRevenue)),
            ServiceStat(id = 4, name = "total_guests", orderCount = totalGuests),
        )
    }
}
