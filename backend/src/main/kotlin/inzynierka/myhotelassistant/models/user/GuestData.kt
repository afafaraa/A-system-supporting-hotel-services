package inzynierka.myhotelassistant.models.user

import java.time.Instant

data class GuestData(
    val roomNumber: String,
    val checkInDate: Instant,
    val checkOutDate: Instant,
)
