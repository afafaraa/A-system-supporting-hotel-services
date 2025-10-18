package inzynierka.myhotelassistant.controllers.management

import inzynierka.myhotelassistant.models.management.SystemSettingsEntity
import inzynierka.myhotelassistant.services.management.SettingsService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody

@RestController
@RequestMapping("/settings")
class SettingsController(
    private val settingsService: SettingsService
) {
    @GetMapping
    fun getSettings() = ResponseEntity.ok(settingsService.getSettings())

    @PutMapping
    fun updateSettings(@RequestBody request: SystemSettingsEntity) =
        ResponseEntity.ok(settingsService.updateSettings(request))

    @GetMapping("available-timezones")
    fun getAvailableTimezones() = ResponseEntity.ok(settingsService.getAvailableTimezones())

    @GetMapping("available-languages")
    fun getAvailableLanguages() = ResponseEntity.ok(settingsService.getAvailableLanguages())
}