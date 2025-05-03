package inzynierka.myhotelassistant.models.service

data class WeekdayHour(
    val day: Weekday,
    var startHour: Int,
    var endHour: Int,
)
