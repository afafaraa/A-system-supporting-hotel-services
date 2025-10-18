package inzynierka.myhotelassistant.models.management

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document

@Document(collection = "system_settings")
data class SystemSettingsEntity(
    @Id val id: String = "default_settings",
    var hotelName: String,
    var address: String,
    var phoneNumber: String,
    var email: String,
    var timezone: String = "Europe/Warsaw",
    var defaultLanguage: String = "EN",
)