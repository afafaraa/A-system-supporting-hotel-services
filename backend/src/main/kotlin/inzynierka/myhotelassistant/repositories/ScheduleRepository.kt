package inzynierka.myhotelassistant.repositories

import inzynierka.myhotelassistant.models.schedule.OrderStatus
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

    fun findByGuestIdAndStatusIsIn(
        guestId: String,
        status: List<OrderStatus>,
    ): List<ScheduleEntity>
}
