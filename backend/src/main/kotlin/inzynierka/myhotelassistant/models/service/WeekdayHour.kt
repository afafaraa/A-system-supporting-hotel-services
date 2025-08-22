package inzynierka.myhotelassistant.models.service

import java.time.DayOfWeek

data class WeekdayHour(
    val day: DayOfWeek,
    var startHour: Int,
    var endHour: Int,
) {
    fun toWeekdayHour(): WeekdayHour = WeekdayHour(day, startHour, endHour)
}
