package inzynierka.myhotelassistant.models.user

import java.time.LocalDateTime

data class EmployeeData(
    var department: Department = Department.FOOD_AND_BEVERAGE,
    var sectors: List<Sector> = listOf(Sector.BREAKFAST, Sector.LUNCH),
    var hireDate: LocalDateTime = LocalDateTime.now(),
)
