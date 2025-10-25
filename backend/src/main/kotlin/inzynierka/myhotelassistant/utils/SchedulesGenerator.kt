package inzynierka.myhotelassistant.utils

import inzynierka.myhotelassistant.models.schedule.ScheduleEntity
import inzynierka.myhotelassistant.repositories.ScheduleRepository
import inzynierka.myhotelassistant.repositories.ServiceRepository
import inzynierka.myhotelassistant.services.EmployeeService
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Component
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.LocalTime
import kotlin.collections.any
import kotlin.random.Random

@Component
class SchedulesGenerator(
    private val serviceRepository: ServiceRepository,
    private val employeeService: EmployeeService,
    private val scheduleRepository: ScheduleRepository,
) {
    private val logger = LoggerFactory.getLogger(this::class.java)

    @Value("\${app.schedules-generator.days-ahead:21}")
    private lateinit var daysAhead: Integer

    // @PostConstruct
    fun createSchedules() {
        val startDate = LocalDateTime.now().toLocalDate()
        val endDate = startDate.plusDays(daysAhead.toLong())
        createSchedules(startDate, endDate)

        // Past schedules for testing purposes
        createSchedules(startDate.minusWeeks(2), startDate.minusDays(1))
    }

    private fun createSchedules(
        start: LocalDate,
        end: LocalDate,
    ) {
        val services = serviceRepository.findAll()
        val employees = employeeService.getAllEmployeesWithEmployeeRole()
        val schedulesToSave = mutableListOf<ScheduleEntity>()

        val employeeAvailability: MutableMap<String, MutableList<Pair<LocalDateTime, LocalDateTime>>> =
            employees
                .associate { employee ->
                    employee.id!! to mutableListOf<Pair<LocalDateTime, LocalDateTime>>()
                }.toMutableMap()

        for (service in services) {
            val latest =
                scheduleRepository.findFirstByServiceIdAndServiceDateBetweenOrderByServiceDateDesc(
                    serviceId = service.id!!,
                    startDate = start.atTime(LocalTime.MIN),
                    endDate = end.atTime(LocalTime.MAX),
                )
            // If the latest schedule is already on the last day, skip creating new schedules
            if (latest != null && latest.serviceDate.toLocalDate().isEqual(end)) {
                continue
            }
            // If there are schedules for this service, start from the next day after the latest one
            val localStart: LocalDate =
                latest?.serviceDate?.toLocalDate()?.plusDays(1)
                    ?: start

            var currentDate = localStart
            while (!currentDate.isAfter(end)) {
                val numberOfServicesToday = Random.nextInt(2, 6)
                repeat(numberOfServicesToday) {
                    val availableWeekdayHours = service.weekday.filter { it.day == currentDate.dayOfWeek }
                    if (availableWeekdayHours.isEmpty()) return@repeat

                    val randomWeekdayHour = availableWeekdayHours.random()
                    val serviceDurationMinutes = service.duration.inWholeMinutes

                    var assigned = false

                    val startTime = LocalTime.of(randomWeekdayHour.startHour, 0)
                    val endTime = LocalTime.of(randomWeekdayHour.endHour, 0)
                    val possibleStartTimes =
                        generateSequence(startTime) { it.plusMinutes(15) }
                            .takeWhile { !it.plusMinutes(serviceDurationMinutes).isAfter(endTime) }
                            .toList()
                            .shuffled()

                    for (potentialStartTime in possibleStartTimes) {
                        val proposedDateTime = currentDate.atTime(potentialStartTime)
                        val serviceEndTime = proposedDateTime.plusMinutes(serviceDurationMinutes)
                        val breakEndTime = serviceEndTime.plusMinutes(15) // 15 min break

                        val chosenEmployee =
                            employees.shuffled().firstOrNull { employee ->
                                val occupiedSlots = employeeAvailability[employee.id!!] ?: mutableListOf()
                                val hasOverlap =
                                    occupiedSlots.any { (slotStart, slotEnd) ->
                                        proposedDateTime.isBefore(slotEnd) && serviceEndTime.isAfter(slotStart)
                                    }
                                !hasOverlap
                            } ?: continue

                        val scheduleEntity =
                            ScheduleEntity(
                                serviceId = service.id,
                                serviceDate = proposedDateTime,
                                weekday = currentDate.dayOfWeek,
                                employeeId = chosenEmployee.id!!,
                            )

                        employeeAvailability[chosenEmployee.id]?.add(proposedDateTime to breakEndTime)

                        schedulesToSave.add(scheduleEntity)
                        logger.info(
                            "Schedule added: ${service.name} on $currentDate at $proposedDateTime with Employee ${chosenEmployee.id}",
                        )
                        assigned = true
                        break
                    }
                    if (!assigned) {
                        logger.warn("Could not find a suitable time and employee for service ${service.name} on $currentDate")
                    }
                }
                currentDate = currentDate.plusDays(1)
            }
        }
        scheduleRepository.saveAll(schedulesToSave)
    }
}
