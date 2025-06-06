package inzynierka.myhotelassistant.repositories

import inzynierka.myhotelassistant.models.schedule.ScheduleEntity
import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.stereotype.Repository

@Repository
interface ScheduleRepository : MongoRepository<ScheduleEntity, String>
