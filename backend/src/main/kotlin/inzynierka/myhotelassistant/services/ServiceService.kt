package inzynierka.myhotelassistant.services

import inzynierka.myhotelassistant.exceptions.HttpException.EntityNotFoundException
import inzynierka.myhotelassistant.models.schedule.OrderStatus
import inzynierka.myhotelassistant.models.service.ServiceEntity
import inzynierka.myhotelassistant.repositories.ScheduleRepository
import inzynierka.myhotelassistant.repositories.ServiceRepository
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service
import java.lang.IllegalArgumentException
import java.util.Optional

@Service
class ServiceService(
    private val serviceRepository: ServiceRepository,
    private val scheduleRepository: ScheduleRepository,
) {
    fun getAllAvailable(pageable: Pageable): List<ServiceEntity> =
        serviceRepository
            .findAllByDisabledFalse(pageable)
            .content

    fun findAll(): List<ServiceEntity> = serviceRepository.findAll()

    fun findById(id: String): Optional<ServiceEntity> = serviceRepository.findById(id)

    fun findByIdOrThrow(id: String): ServiceEntity =
        serviceRepository
            .findById(id)
            .orElseThrow { EntityNotFoundException("Service not found") }

    fun findByName(name: String): ServiceEntity? =
        serviceRepository
            .findFirstByNameIgnoreCase(name)

    fun save(service: ServiceEntity): ServiceEntity = serviceRepository.save(service)

    fun getSchedulesByIds(ids: List<String>): Map<String, ServiceEntity> {
        if (ids.isEmpty()) return emptyMap()
        return serviceRepository.findAllById(ids).associateBy { it.id!! }
    }

    fun deleteService(
        serviceId: String,
        deleteOption: Int,
    ) {
        val service =
            serviceRepository.findById(serviceId).orElseThrow {
                IllegalArgumentException("Could not find service with given 'id':$serviceId")
            }

        val relatedOrders = scheduleRepository.findAllByServiceId(serviceId)

        when (deleteOption) {
            1 -> {
                val toDelete =
                    relatedOrders.filter {
                        it.status == OrderStatus.AVAILABLE || it.status == OrderStatus.REQUESTED
                    }
                scheduleRepository.deleteAll(toDelete)
            }
            2 -> {
                val toDelete = relatedOrders.filter { it.status == OrderStatus.AVAILABLE }
                scheduleRepository.deleteAll(toDelete)
            }
            else -> throw IllegalArgumentException("Incorrect delete option")
        }
        serviceRepository.delete(service)
    }
}
