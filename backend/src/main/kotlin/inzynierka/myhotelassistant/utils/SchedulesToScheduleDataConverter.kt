package inzynierka.myhotelassistant.utils

import inzynierka.myhotelassistant.dto.ScheduleData
import inzynierka.myhotelassistant.models.schedule.ScheduleEntity
import inzynierka.myhotelassistant.repositories.UserRepository
import inzynierka.myhotelassistant.services.ServiceService
import org.springframework.stereotype.Component
import java.time.LocalDate
import java.time.LocalTime
import java.time.temporal.ChronoUnit
import kotlin.collections.get

@Component
class SchedulesToScheduleDataConverter(
    private val serviceService: ServiceService,
    private val userRepository: UserRepository,
) {
    private operator fun LocalTime.plus(minutes: Long): LocalTime = this.plus(minutes, ChronoUnit.MINUTES)

    fun convert(
        schedules: List<ScheduleEntity>,
        date: LocalDate,
    ): ScheduleData {
        val serviceIds = schedules.map { it.serviceId }.distinct()
        val servicesMap = serviceService.getSchedulesByIds(serviceIds)
        val guestIds = schedules.mapNotNull { it.guestId }.distinct()
        val guestsMap = userRepository.findAllById(guestIds).associateBy { it.id!! }
        val startTime = schedules.minOf { it -> it.serviceDate.toLocalTime() }
        val endTime =
            schedules.maxOf { it ->
                it.serviceDate.toLocalTime().plus(servicesMap[it.serviceId]?.duration?.inWholeMinutes ?: 10)
            }
        return ScheduleData(
            schedules =
                schedules.map { schedule ->
                    ScheduleData.convertToDTO(
                        schedule = schedule,
                        guest = guestsMap[schedule.guestId],
                        service = servicesMap[schedule.serviceId],
                    )
                },
            startDate = startTime.atDate(date),
            endDate = endTime.atDate(date),
        )
    }
}
