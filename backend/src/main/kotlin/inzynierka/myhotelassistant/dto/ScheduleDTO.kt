package inzynierka.myhotelassistant.dto

import inzynierka.myhotelassistant.models.schedule.ScheduleEntity
import inzynierka.myhotelassistant.models.service.ServiceEntity
import inzynierka.myhotelassistant.models.user.UserEntity

data class ScheduleDTO(
    val id: String,
    val serviceId: String,
    val title: String?,
    val date: String,
    val duration: Long?,
    val weekday: String,
    val guestName: String?,
    val room: String?,
    val orderTime: String?,
    val status: String,
) {
    companion object {
        fun toDTO(
            schedule: ScheduleEntity,
            service: ServiceEntity?,
            guest: UserEntity?,
        ) = ScheduleDTO(
            id = schedule.id!!,
            serviceId = schedule.serviceId,
            title = service?.name,
            duration = service?.duration,
            date = schedule.serviceDate.toString(),
            weekday = schedule.serviceDate.dayOfWeek.name,
            guestName = guest?.let { "${it.name} ${it.surname}" },
            room = guest?.guestData?.roomNumber,
            orderTime = schedule.orderTime?.toString(),
            status = schedule.status.name,
        )
    }
}
