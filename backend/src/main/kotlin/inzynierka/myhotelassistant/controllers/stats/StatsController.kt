package inzynierka.myhotelassistant.controllers.stats

import inzynierka.myhotelassistant.services.StatsService
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/management/stats")
class StatsController(
    private val statsService: StatsService,
) {
    @GetMapping
    fun getStats(): List<StatsService.ServiceStat> = statsService.getStats()
}
