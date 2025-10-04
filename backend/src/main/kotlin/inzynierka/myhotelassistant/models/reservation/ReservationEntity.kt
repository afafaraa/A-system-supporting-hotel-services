package inzynierka.myhotelassistant.models.reservation

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.index.CompoundIndex
import org.springframework.data.mongodb.core.mapping.Document
import org.springframework.data.mongodb.core.mapping.Field
import java.time.LocalDate
import java.time.LocalDateTime

@Document(collection = "reservations")
@CompoundIndex(def = "{'roomNumber': 1, 'checkIn': 1, 'checkOut': 1}")
data class ReservationEntity(
    @Id val id: String? = null,
    val roomNumber: String,
    val guestId: String,
    var guestsCount: Int,
    val checkIn: LocalDate,
    val checkOut: LocalDate,
    val reservationPrice: Double,
    var paid: Boolean = false,
    val specialRequests: String? = null,
) {
    @Field("status")
    var status: ReservationStatus = ReservationStatus.REQUESTED
        set(value) {
            field = value
            blocksRoom = value.blocksRoom
        }

    @Field("blocksRoom")
    var blocksRoom: Boolean = status.blocksRoom

    @Field("createdAt")
    var createdAt: LocalDateTime = LocalDateTime.now()

    @Field("rejectReason")
    var rejectReason: String? = null
}
