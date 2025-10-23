package inzynierka.myhotelassistant.models.user

import java.time.Instant

data class GuestData(
    var roomNumber: String,
    val checkInDate: Instant,
    val checkOutDate: Instant,
    var bill: Double = 0.0,
)
