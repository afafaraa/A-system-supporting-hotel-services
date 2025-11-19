package inzynierka.myhotelassistant.utils

import inzynierka.myhotelassistant.models.schedule.ScheduleEntity
import inzynierka.myhotelassistant.models.service.ServiceEntity
import inzynierka.myhotelassistant.models.user.UserEntity
import inzynierka.myhotelassistant.repositories.ScheduleRepository
import inzynierka.myhotelassistant.repositories.ServiceRepository
import inzynierka.myhotelassistant.services.EmployeeService
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Component
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.LocalTime
import kotlin.collections.any
import kotlin.collections.get
import kotlin.collections.map
import kotlin.collections.set

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
        val startDate = LocalDate.now()
        val endDate = startDate.plusDays(daysAhead.toLong() - 1)
        createSchedules(startDate, endDate)

        // Past schedules for testing purposes
        createSchedules(startDate.minusWeeks(2), startDate.minusDays(1))
    }

    private fun getServicePossibleStartTimes(
        service: ServiceEntity,
        date: LocalDate,
    ): List<LocalTime> {
        val serviceDurationMinutes = service.duration.inWholeMinutes
        val availableWeekdayHours = service.weekday.filter { it.day == date.dayOfWeek }
        if (availableWeekdayHours.isEmpty()) return emptyList()
        val possibleStartTimes =
            availableWeekdayHours
                .map { weekdayHour ->
                    val startTime = LocalTime.of(weekdayHour.startHour, 0)
                    val endTime = LocalTime.of(weekdayHour.endHour, 0)
                    generateSequence(startTime) { it.plusMinutes(15) }
                        .takeWhile { !it.plusMinutes(serviceDurationMinutes).isAfter(endTime) }
                }.flatMap { it }
                .shuffled()
        return possibleStartTimes
    }

    private fun getEmployeeAvailabilityEmptyMap(
        employees: List<UserEntity>,
    ): MutableMap<String, MutableList<Pair<LocalDateTime, LocalDateTime>>> =
        employees
            .associate { employee ->
                employee.id!! to mutableListOf<Pair<LocalDateTime, LocalDateTime>>()
            }.toMutableMap()

    private fun createSchedules(
        start: LocalDate,
        end: LocalDate,
    ) {
        logger.info("Starting schedule generation for period $start to $end")
        val services = serviceRepository.findAll()
        val employees = employeeService.getAllEmployeesWithEmployeeRole()
        val employeeAvailability = getEmployeeAvailabilityEmptyMap(employees)
        val schedulesCount = services.associate { it.id!! to 0 }.toMutableMap()

        val groupedByLastDate =
            services
                .groupBy {
                    scheduleRepository
                        .findFirstByServiceIdAndServiceDateBetweenOrderByServiceDateDesc(
                            serviceId = it.id!!,
                            startDate = start.atTime(LocalTime.MIN),
                            endDate = end.atTime(LocalTime.MAX),
                        )?.serviceDate
                        ?.toLocalDate()
                        ?.plusDays(1) ?: start
                }.mapValues { it.value.shuffled() }

        var currDate = groupedByLastDate.keys.min()
        val servicesToGenerate = mutableListOf<Pair<ServiceEntity, List<LocalTime>>>()
        while (!currDate.isAfter(end)) {
            groupedByLastDate[currDate]?.let { services ->
                servicesToGenerate.addAll(services.map { it to getServicePossibleStartTimes(it, currDate) })
            }
            generateForTheDay(
                date = currDate,
                servicesWithDateTimes = servicesToGenerate,
                employees = employees,
                schedulesCount = schedulesCount,
                employeeAvailability = employeeAvailability,
            )
            currDate = currDate.plusDays(1)
        }
        for (service in services) {
            val count = schedulesCount[service.id!!] ?: 0
            if (count == 0) continue
            logger.info(
                "Generated $count new schedules for service '${service.name}' (${service.duration.inWholeMinutes}min) in period $start to $end",
            )
        }
    }

    @Scheduled(cron = "0 20 22 * * ?") // every day at 23:50
    private fun createSchedulesForSingleDay() {
        val date = LocalDate.now().plusDays(daysAhead.toLong())
        logger.info(
            "Scheduled task: Starting schedule generation for date $date",
        )
        val services =
            serviceRepository
                .findAll()
                .filter {
                    !scheduleRepository.existsByServiceIdAndServiceDateBetween(
                        serviceId = it.id!!,
                        startDate = date.atTime(LocalTime.MIN),
                        endDate = date.atTime(LocalTime.MAX),
                    )
                }
        generateForTheDay(
            date = date,
            servicesWithDateTimes = services.map { it to getServicePossibleStartTimes(it, date) },
            employees = employeeService.getAllEmployeesWithEmployeeRole(),
        )
    }

    private fun generateForTheDay(
        date: LocalDate,
        servicesWithDateTimes: List<Pair<ServiceEntity, List<LocalTime>>>,
        employees: List<UserEntity>,
        schedulesCount: MutableMap<String, Int> = servicesWithDateTimes.associate { (s, _) -> s.id!! to 0 }.toMutableMap(),
        employeeAvailability: MutableMap<String, MutableList<Pair<LocalDateTime, LocalDateTime>>> =
            getEmployeeAvailabilityEmptyMap(employees),
    ) {
        fun chooseEmployeeForSchedule(
            proposedDateTime: LocalDateTime,
            serviceEndTime: LocalDateTime,
        ): UserEntity? {
            val breakEndTime = serviceEndTime.plusMinutes(15) // 15 min break
            val chosenEmployee =
                employees.shuffled().firstOrNull { employee ->
                    val occupiedSlots = employeeAvailability[employee.id!!] ?: mutableListOf()
                    val hasOverlap =
                        occupiedSlots.any { (slotStart, slotEnd) ->
                            proposedDateTime.isBefore(slotEnd) && serviceEndTime.isAfter(slotStart)
                        }
                    !hasOverlap
                }
            if (chosenEmployee != null) {
                employeeAvailability[chosenEmployee.id]?.add(proposedDateTime to breakEndTime)
            }
            return chosenEmployee
        }

        val schedulesToSave = mutableListOf<ScheduleEntity>()
        val checkedServices = servicesWithDateTimes.toMutableList()
        var iterCount = 0 // safety to prevent infinite loops
        while (checkedServices.isNotEmpty()) { // making sure that we used all available datetime slots
            iterCount += 1
            if (iterCount > 100) {
                logger.warn("Reached maximum iterations while generating schedules for date $date")
                break
            }
            checkedServices.sortBy { (s, _) -> schedulesCount[s.id!!] }
            val servicesIterator = checkedServices.listIterator()
            while (servicesIterator.hasNext()) {
                var generated = false
                val (service, possibleStartTimes) = servicesIterator.next()
                for (potentialStartTime in possibleStartTimes) {
                    val proposedDateTime = date.atTime(potentialStartTime)
                    val serviceEndTime = proposedDateTime.plusMinutes(service.duration.inWholeMinutes)
                    val chosenEmployee =
                        chooseEmployeeForSchedule(proposedDateTime, serviceEndTime)
                            ?: continue
                    val scheduleEntity =
                        ScheduleEntity(
                            serviceId = service.id!!,
                            serviceDate = proposedDateTime,
                            weekday = date.dayOfWeek,
                            employeeId = chosenEmployee.id!!,
                        )
                    schedulesToSave.add(scheduleEntity)
                    generated = true
                    schedulesCount[service.id] = schedulesCount.getOrDefault(service.id, 0) + 1
                    break
                }
                if (!generated) {
                    servicesIterator.remove()
                }
            }
        }
        scheduleRepository.saveAll(schedulesToSave)

        for ((service, _) in servicesWithDateTimes) {
            val count = schedulesCount[service.id!!] ?: 0
            if (count == 0) continue
            logger.info(
                "Generated $count new schedules for service '${service.name}' (${service.duration.inWholeMinutes}min) on date $date",
            )
        }
    }
}
