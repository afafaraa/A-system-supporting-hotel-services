package inzynierka.myhotelassistant.models.user

import com.fasterxml.jackson.annotation.JsonProperty
import inzynierka.myhotelassistant.models.reservation.ReservationEntity
import org.springframework.data.mongodb.core.mapping.DBRef
import java.time.LocalDateTime

data class GuestData(
    @DBRef(lazy = false)
    var currentReservation: ReservationEntity,
    private var bill: Double = 0.0,
    @field:JsonProperty("billElements")
    private var billElements: MutableList<BillElement> = mutableListOf(),
) {
    fun getBill(): Double = bill

    fun getBillElements(): List<BillElement> = billElements

    fun addServiceToBill(
        scheduleId: String,
        price: Double,
        addedDate: LocalDateTime = LocalDateTime.now(),
    ) {
        bill += price
        billElements.add(
            BillElement(
                type = BillElement.Type.SERVICE,
                id = scheduleId,
                price = price,
                addedDate = addedDate,
            ),
        )
    }

    fun addReservationToBill(
        reservationId: String,
        price: Double,
        addedDate: LocalDateTime = LocalDateTime.now(),
    ) {
        bill += price
        billElements.add(
            BillElement(
                type = BillElement.Type.RESERVATION,
                id = reservationId,
                price = price,
                addedDate = addedDate,
            ),
        )
    }

    fun removeElementFromBill(elementId: String) {
        val element = billElements.find { it.id == elementId }
        if (element != null) {
            bill -= element.price
            billElements.remove(element)
        }
    }

    data class BillElement(
        val type: Type,
        val id: String, // reservation / schedule id
        val price: Double,
        val addedDate: LocalDateTime = LocalDateTime.now(),
    ) {
        enum class Type {
            RESERVATION,
            SERVICE,
        }
    }
}
