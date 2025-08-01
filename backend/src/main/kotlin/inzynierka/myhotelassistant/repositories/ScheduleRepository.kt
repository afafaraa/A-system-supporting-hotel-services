package inzynierka.myhotelassistant.repositories

import inzynierka.myhotelassistant.models.schedule.ScheduleEntity
import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.stereotype.Repository
import java.time.LocalDateTime

@Repository
interface ScheduleRepository : MongoRepository<ScheduleEntity, String> {
    fun findByServiceIdAndServiceDateBetween(
        serviceId: String,
        startDate: LocalDateTime,
        endDate: LocalDateTime,
    ): List<ScheduleEntity>

    fun findByEmployeeIdAndServiceDateBetween(
        employeeId: String,
        startDate: LocalDateTime,
        endDate: LocalDateTime,
    ): List<ScheduleEntity>

    fun findFirstByServiceIdAndServiceDateBetweenOrderByServiceDateDesc(
        serviceId: String,
        startDate: LocalDateTime,
        endDate: LocalDateTime,
    ): ScheduleEntity?

    fun findAllByServiceId(
        serviceId: String,
    ): List<ScheduleEntity>
}
