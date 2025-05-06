package inzynierka.myhotelassistant.repositories

import inzynierka.myhotelassistant.models.order.OrderEntity
import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.stereotype.Repository

@Repository
interface OrderRepository : MongoRepository<OrderEntity, String>
