package inzynierka.myhotelassistant.services.management

import inzynierka.myhotelassistant.models.management.Language
import inzynierka.myhotelassistant.models.management.SystemSettingsEntity
import inzynierka.myhotelassistant.models.management.Timezone
import inzynierka.myhotelassistant.repositories.management.SettingsRepository
import jakarta.annotation.PostConstruct
import org.springframework.stereotype.Service

@Service
class SettingsService(
    private val settingsRepository: SettingsRepository,
) {
    private val defaultSettingsId = "default_settings"

    data class TimezoneOption(
        val zoneId: String,
        val displayName: String,
    )

    data class LanguageOption(
        val code: String,
        val displayName: String,
    )

    @PostConstruct
    fun init() {
        createDefaultSettingsIfNotExists()
    }

    private fun createDefaultSettingsIfNotExists(): SystemSettingsEntity {
        val existingSettings = settingsRepository.findById(defaultSettingsId)
        if (existingSettings.isPresent) {
            return existingSettings.get()
        }

        val defaultSettings =
            SystemSettingsEntity(
                id = defaultSettingsId,
                hotelName = "Grand Hotel",
                address = "ExampleStreet 123, Kraków",
                phoneNumber = "1234567890",
                email = "example@gmail.com",
                timezone = "Europe/Warsaw",
                defaultLanguage = "EN",
            )
        return settingsRepository.save(defaultSettings)
    }

    fun getSettings(): SystemSettingsEntity {
        val settings =
            settingsRepository
                .findById(defaultSettingsId)
                .orElseThrow {
                    throw RuntimeException("Settings not found")
                }
        return settings
    }

    fun updateSettings(request: SystemSettingsEntity): SystemSettingsEntity {
        val settings = getSettings()
        val updatedSettings =
            settings.copy(
                hotelName = request.hotelName,
                address = request.address,
                phoneNumber = request.phoneNumber,
                email = request.email,
                timezone = request.timezone,
                defaultLanguage = request.defaultLanguage,
            )
        return settingsRepository.save(updatedSettings)
    }

    fun getAvailableLanguages(): List<LanguageOption> {
        val languages =
            Language.entries.map { language ->
                LanguageOption(
                    language.code,
                    language.displayName,
                )
            }
        return languages
    }

    fun getAvailableTimezones(): List<TimezoneOption> {
        val timezones =
            Timezone.entries.map { zone ->
                TimezoneOption(
                    zone.zoneId,
                    zone.displayName,
                )
            }
        return timezones
    }
}
