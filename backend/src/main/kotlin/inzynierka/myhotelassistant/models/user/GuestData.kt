package inzynierka.myhotelassistant.models.user

import inzynierka.myhotelassistant.models.reservation.ReservationEntity
import org.springframework.data.mongodb.core.mapping.DBRef

data class GuestData(
    @DBRef(lazy = false)
    var currentReservation: ReservationEntity,
    var bill: Double = 0.0,
)
