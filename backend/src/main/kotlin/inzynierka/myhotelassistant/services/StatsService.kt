package inzynierka.myhotelassistant.services

import inzynierka.myhotelassistant.models.schedule.OrderStatus
import inzynierka.myhotelassistant.models.stats.DailySales
import inzynierka.myhotelassistant.models.stats.ServiceStat
import inzynierka.myhotelassistant.models.stats.StatsResponse
import inzynierka.myhotelassistant.repositories.ScheduleRepository
import inzynierka.myhotelassistant.repositories.ServiceRepository
import org.springframework.stereotype.Service
import java.time.format.DateTimeFormatter

@Service
class StatsService(
    private val scheduleRepository: ScheduleRepository,
    private val serviceRepository: ServiceRepository,
) {
    data class ServiceStatsDto( // TO-DO  Remove this DTO after presentation
        val id: String,
        val name: String,
        val orderCount: Int,
        val revenue: Double,
    )

    fun getStats(): StatsResponse {
        val allOrders =
            scheduleRepository
                .findAll()
                .filter { it.status != OrderStatus.CANCELED }

        val totalPurchases = allOrders.count()
        val totalRevenue = allOrders.sumOf { serviceRepository.findById(it.serviceId).get().price }

        val grouped = allOrders.groupBy { it.serviceId }
        val popularServices =
            grouped.mapNotNull { (serviceId, items) ->
                serviceRepository.findById(serviceId).takeIf { it.isPresent }?.get()?.let { service ->
                    ServiceStat(service.name, (items.size * 100) / totalPurchases)
                }
            }

        val formatter = DateTimeFormatter.ofPattern("dd.MM")
        val salesOverTime =
            allOrders
                .groupBy { it.serviceDate.format(formatter) }
                .map { (date, list) -> DailySales(date, list.size) }
                .sortedBy { it.date }

        return StatsResponse(
            totalPurchases,
            totalRevenue,
            popularServices,
            salesOverTime,
        )
    }

    fun getServiceStats(): List<ServiceStatsDto> {
        val allServices = serviceRepository.findAll()
        val allSchedules = scheduleRepository.findAll()

        return allServices.map { service ->
            val relatedSchedules = allSchedules.filter { it.serviceId == service.id && it.status != OrderStatus.AVAILABLE }
            val totalRevenue = relatedSchedules.sumOf { service.price }

            ServiceStatsDto(
                id = service.id ?: "",
                name = service.name,
                orderCount = relatedSchedules.size,
                revenue = totalRevenue,
            )
        }
    }
}
