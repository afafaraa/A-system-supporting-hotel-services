package inzynierka.myhotelassistant.models.stats

data class StatsResponse(
    val totalPurchases: Int,
    val totalRevenue: Double,
    val popularServices: List<ServiceStat>,
    val salesOverTime: List<DailySales>
)
