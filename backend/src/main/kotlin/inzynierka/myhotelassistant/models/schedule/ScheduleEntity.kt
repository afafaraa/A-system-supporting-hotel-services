package inzynierka.myhotelassistant.models.schedule

import inzynierka.myhotelassistant.models.service.Weekday
import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document
import java.time.DayOfWeek
import java.time.Instant

@Document(collection = "schedule")
data class ScheduleEntity (
    @Id var id: String? = null,
    var serviceId: String,
    var serviceDate: Instant,
    var weekday: DayOfWeek,
    var active: Boolean,
)