package inzynierka.myhotelassistant.services

import inzynierka.myhotelassistant.models.schedule.ScheduleEntity
import inzynierka.myhotelassistant.repositories.ScheduleRepository
import org.springframework.stereotype.Service
import java.time.DayOfWeek
import java.time.Instant
import java.time.ZoneId
import java.time.temporal.ChronoUnit
import java.time.temporal.TemporalAdjusters
import java.util.Optional

@Service
class ScheduleService(private val scheduleRepository: ScheduleRepository) {
    fun findAll(): List<ScheduleEntity> = scheduleRepository.findAll()

    fun findById(id: String): ScheduleEntity? {
        val schedule = scheduleRepository.findById(id)
        return if (schedule.isPresent) {schedule.get()} else null
    }

    fun findScheduleForCurrentWeekById(id: String, date: Instant): List<ScheduleEntity?> {

        val endOfWeek = date.atZone(ZoneId.systemDefault())
            .with(TemporalAdjusters.nextOrSame(DayOfWeek.SUNDAY))
            .truncatedTo(ChronoUnit.DAYS)
            .toInstant()
            .plus(1, ChronoUnit.DAYS)

        val startOfWeek = endOfWeek
            .minus(6, ChronoUnit.DAYS)

        return this.scheduleRepository.findAll()
            .filter {
                it.serviceId == id
            }
            .filter{
                val serviceDate = it.serviceDate.truncatedTo(ChronoUnit.DAYS)
                val isInRange = serviceDate >= startOfWeek.truncatedTo(ChronoUnit.DAYS) && serviceDate < endOfWeek.truncatedTo(ChronoUnit.DAYS)

                isInRange
            }
    }
}