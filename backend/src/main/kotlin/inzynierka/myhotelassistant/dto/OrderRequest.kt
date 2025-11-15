package inzynierka.myhotelassistant.dto

import java.time.LocalDate

data class OrderRequest(
    val schedules: List<ScheduleIdWithSpecialRequests>,
    val reservations: List<NewReservationRequest>,
) {
    data class ScheduleIdWithSpecialRequests(
        val id: String,
        val specialRequests: String?,
    )

    data class NewReservationRequest(
        val roomNumber: String,
        val guestsCount: Int,
        val checkIn: LocalDate,
        val checkOut: LocalDate,
        val specialRequests: String?,
    )
}
