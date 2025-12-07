package inzynierka.myhotelassistant.utils

import inzynierka.myhotelassistant.controllers.schedule.ScheduleController
import inzynierka.myhotelassistant.dto.ScheduleDTO
import inzynierka.myhotelassistant.models.schedule.ScheduleEntity
import inzynierka.myhotelassistant.repositories.UserRepository
import inzynierka.myhotelassistant.services.ServiceService
import org.springframework.stereotype.Component
import kotlin.collections.get

@Component
class SchedulesToDTOConverter(
    private val serviceService: ServiceService,
    private val userRepository: UserRepository,
) {
    fun convertList(schedules: List<ScheduleEntity>): List<ScheduleDTO> {
        if (schedules.isEmpty()) return emptyList()
        val serviceIds = schedules.map { it.serviceId }.distinct()
        val servicesMap = serviceService.getSchedulesByIds(serviceIds)
        val guestIds = schedules.mapNotNull { it.guestId }.distinct()
        val guestsMap = userRepository.findAllById(guestIds).associateBy { it.id!! }
        return schedules.map { schedule ->
            ScheduleDTO.toDTO(
                schedule = schedule,
                guest = guestsMap[schedule.guestId],
                service = servicesMap[schedule.serviceId],
            )
        }
    }

    fun convert(schedule: ScheduleEntity): ScheduleDTO =
        ScheduleDTO.toDTO(
            schedule = schedule,
            guest = userRepository.findById(schedule.guestId ?: "").orElse(null),
            service = serviceService.findByIdOrThrow(schedule.serviceId),
        )

    fun convertForTransactionsHistory(schedule: ScheduleEntity): ScheduleController.ScheduleForTransactionsHistory {
        val service = serviceService.findByIdOrThrow(schedule.serviceId)
        return ScheduleController.ScheduleForTransactionsHistory(
            id = schedule.id!!,
            title = service.name,
            date = schedule.serviceDate,
            duration = service.duration.inWholeMinutes,
            specialRequests = schedule.specialRequests,
            thumbnailUrl = service.image,
        )
    }
}
