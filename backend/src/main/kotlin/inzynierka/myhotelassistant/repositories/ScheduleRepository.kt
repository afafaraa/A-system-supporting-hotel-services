package inzynierka.myhotelassistant.repositories

import inzynierka.myhotelassistant.models.schedule.OrderStatus
import inzynierka.myhotelassistant.models.schedule.ScheduleEntity
import org.springframework.data.mongodb.repository.Aggregation
import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.stereotype.Repository
import java.time.LocalDateTime

@Repository
interface ScheduleRepository : MongoRepository<ScheduleEntity, String> {
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

    fun existsByServiceIdAndServiceDateBetween(
        serviceId: String,
        startDate: LocalDateTime,
        endDate: LocalDateTime,
    ): Boolean

    fun deleteByStatusAndServiceDateBefore(
        status: OrderStatus,
        beforeDate: LocalDateTime,
    ): Long

    fun findAllByServiceId(serviceId: String): List<ScheduleEntity>

    fun findByGuestId(guestId: String): List<ScheduleEntity>

    fun findByGuestIdInAndStatusIn(
        guestIds: List<String>,
        statuses: List<OrderStatus>,
    ): List<ScheduleEntity>

    fun findAllByStatusIn(statuses: List<OrderStatus>): List<ScheduleEntity>

    fun findByStatusInAndServiceDateBetween(
        statuses: List<OrderStatus>,
        startDate: LocalDateTime,
        endDate: LocalDateTime,
    ): List<ScheduleEntity>

    fun countAllByOrderTimeBetween(
        startDate: LocalDateTime,
        endDate: LocalDateTime,
    ): Long

    @Aggregation(
        pipeline = [
            "{ \$match: { price: { \$ne: null } } }",
            "{ \$group: { _id: null, total: { \$sum: \"\$price\" } } }",
            "{ \$project: { _id: 0, total: 1 } }",
        ],
    )
    fun sumPriceWhereNotNull(): Double?

    @Aggregation(
        pipeline = [
            "{ '\$match': { 'orderTime': { '\$gte': { '\$date': '?0' }, '\$lte': { '\$date': '?1' } }, 'price': { '\$ne': null } } }",
            "{ '\$group': { '_id': null, 'total': { '\$sum': '\$price' } } }",
            "{ '\$project': { '_id': 0, 'total': 1 } }",
        ],
    )
    fun sumPriceByOrderTimeBetween(
        startTime: LocalDateTime,
        endTime: LocalDateTime,
    ): Double?

    data class ServiceCount(
        val serviceId: String = "",
        val count: Long = 0,
    )

    @Aggregation(
        pipeline = [
            "{ \$match: { orderTime: { \$gte: { \$date: ?0 }, \$lte: { \$date: ?1 } }, status: { \$ne: 'AVAILABLE' } } }",
            "{ \$group: { _id:  '\$serviceId', count:  { \$sum: 1 } } }",
            "{ \$sort:  { count:  -1 } }",
            "{ \$limit: ?2 }",
            "{ \$project:  { serviceId: '\$_id', count: 1, _id: 0 } }",
        ],
    )
    fun getTopServices(
        startTime: LocalDateTime,
        endTime: LocalDateTime,
        limit: Int,
    ): List<ServiceCount>

    fun countByServiceIdAndOrderTimeBetween(
        serviceId: String,
        startDate: LocalDateTime,
        endDate: LocalDateTime,
    ): Long?

    fun countByEmployeeIdAndStatus(
        employeeId: String,
        status: OrderStatus,
    ): Long

    fun countByEmployeeIdAndStatusAndServiceDateBetween(
        employeeId: String,
        status: OrderStatus,
        startDate: LocalDateTime,
        endDate: LocalDateTime,
    ): Long

    fun findAllByStatusAndCompletionOverdueNotificationSentFalseAndServiceDateBefore(
        status: OrderStatus,
        beforeDate: LocalDateTime,
    ): List<ScheduleEntity>

    fun findAllByStatusAndAcceptanceOverdueNotificationSentFalseAndServiceDateBetween(
        status: OrderStatus,
        beforeDate: LocalDateTime,
        afterDate: LocalDateTime,
    ): List<ScheduleEntity>
}
