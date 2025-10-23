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

    fun findByServiceIdAndStatusAndServiceDateBetween(
        serviceId: String,
        status: OrderStatus,
        startDate: LocalDateTime,
        endDate: LocalDateTime,
    ): List<ScheduleEntity>

    fun findByEmployeeIdAndServiceDateBetweenOrderByServiceDate(
        employeeId: String,
        startDate: LocalDateTime,
        endDate: LocalDateTime,
    ): List<ScheduleEntity>

    fun findByEmployeeIdAndStatusInOrderByServiceDate(
        employeeId: String,
        statuses: List<OrderStatus>,
    ): List<ScheduleEntity>

    fun findFirstByServiceIdAndServiceDateBetweenOrderByServiceDateDesc(
        serviceId: String,
        startDate: LocalDateTime,
        endDate: LocalDateTime,
    ): ScheduleEntity?

    fun findAllByServiceId(serviceId: String): List<ScheduleEntity>

    fun findByGuestIdAndStatusIn(
        guestId: String,
        statuses: List<OrderStatus>,
    ): List<ScheduleEntity>

    fun findAllByStatusIn(statuses: List<OrderStatus>): List<ScheduleEntity>

    fun findByStatusInAndServiceDateBetween(
        statuses: List<OrderStatus>,
        startDate: LocalDateTime,
        endDate: LocalDateTime,
    ): List<ScheduleEntity>
}
