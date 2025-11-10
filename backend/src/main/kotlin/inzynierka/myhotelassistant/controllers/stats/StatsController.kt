package inzynierka.myhotelassistant.controllers.stats

import inzynierka.myhotelassistant.services.statisics.MLPredictionService
import inzynierka.myhotelassistant.services.statisics.StatsService
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/management/stats")
class StatsController(
    private val statsService: StatsService,
    private val mlPredictionService: MLPredictionService,
) {
    @GetMapping
    fun getStats(): List<StatsService.ServiceStat> = statsService.getStats()

    @GetMapping("/extended")
    fun getExtendedStats(): StatsService.ExtendedStatsResponse =
        statsService.getExtendedStats()

    @GetMapping("/ml/predict")
    fun predictRevenue(
        @RequestParam(defaultValue = "30") daysAhead: Int
    ): MLPredictionService.MLPredictionResult {
        return mlPredictionService.predictWithML(daysAhead)
    }
}