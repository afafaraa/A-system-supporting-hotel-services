package inzynierka.myhotelassistant.services

import inzynierka.myhotelassistant.repositories.OrderRepository
import org.springframework.stereotype.Service

@Service
class OrderService(val orderRepository: OrderRepository) {
}
