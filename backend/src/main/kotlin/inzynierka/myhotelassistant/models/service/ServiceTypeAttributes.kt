package inzynierka.myhotelassistant.models.service

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document

@Document(collection = "service_type_attributes")
data class ServiceTypeAttributes(
    @Id val id: String? = null,
    var serviceType: ServiceType,
    var attributes: Map<String, Any> = emptyMap()
)

