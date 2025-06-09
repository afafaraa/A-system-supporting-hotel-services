package inzynierka.myhotelassistant.dto

import inzynierka.myhotelassistant.models.schedule.OrderStatus
import java.time.DayOfWeek
import java.time.LocalDateTime

data class ShiftData(
    val id: String,
    val weekday: DayOfWeek,
    val startHour: Int,
    val endHour: Int,
    val title: String,
    val guest: String,
    val status: OrderStatus,
    val serviceId: String?,
)
