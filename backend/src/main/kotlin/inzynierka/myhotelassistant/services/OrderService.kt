package inzynierka.myhotelassistant.services

import inzynierka.myhotelassistant.repositories.NotificationRepository
import inzynierka.myhotelassistant.repositories.OrderRepository
import inzynierka.myhotelassistant.repositories.UserRepository
import org.springframework.stereotype.Service

@Service
class OrderService(val orderRepository: OrderRepository) {
}