package inzynierka.myhotelassistant.models.service

import java.time.DayOfWeek

data class WeekdayHour(
    val day: DayOfWeek,
    val hours: Int,
)
