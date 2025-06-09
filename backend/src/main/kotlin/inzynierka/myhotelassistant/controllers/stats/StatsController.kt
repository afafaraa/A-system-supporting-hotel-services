package inzynierka.myhotelassistant.controllers.stats

import inzynierka.myhotelassistant.models.stats.StatsResponse
import inzynierka.myhotelassistant.services.ServiceStatsDto
import inzynierka.myhotelassistant.services.StatsService
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/management/stats")
class StatsController(private val statsService: StatsService) {
    @GetMapping
    fun getStats(): StatsResponse = statsService.getStats()

    @GetMapping("/services")
    @ResponseStatus(HttpStatus.OK)
    fun getServiceStats(): List<ServiceStatsDto> = statsService.getServiceStats()
}