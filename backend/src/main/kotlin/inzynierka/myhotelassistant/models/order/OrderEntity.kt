package inzynierka.myhotelassistant.models.order

import org.springframework.data.annotation.Id

data class OrderEntity (
    @Id val id: String? = null,
)
