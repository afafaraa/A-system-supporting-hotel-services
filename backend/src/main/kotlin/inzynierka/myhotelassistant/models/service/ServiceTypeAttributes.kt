package inzynierka.myhotelassistant.models.service

import com.fasterxml.jackson.annotation.JsonSubTypes
import com.fasterxml.jackson.annotation.JsonTypeInfo

@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.PROPERTY, property = "type")
@JsonSubTypes(
    JsonSubTypes.Type(ServiceTypeAttributes.Selection::class, name = "SELECTION"),
    JsonSubTypes.Type(ServiceTypeAttributes.Custom::class, name = "CUSTOM"),
)
sealed interface ServiceTypeAttributes {
    fun getType(): ServiceType

    data class OptionObject(
        val label: String,
        val description: String,
        val price: Double,
        val image: String? = null,
    )

    data class Selection(
        val multipleSelection: Boolean,
        val options: LinkedHashMap<String, List<OptionObject>>,
    ): ServiceTypeAttributes {
        override fun getType(): ServiceType = ServiceType.SELECTION
    }


    data class Custom(
        var fields: LinkedHashMap<String, Any>,
    ): ServiceTypeAttributes {
        override fun getType(): ServiceType = ServiceType.CUSTOM
    }
}
