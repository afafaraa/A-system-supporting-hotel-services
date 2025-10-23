package inzynierka.myhotelassistant.models.reservation

enum class ReservationStatus(
    val blocksRoom: Boolean,
) {
    REQUESTED(true),
    CONFIRMED(true),
    CANCELED(false),
    REJECTED(false),
    COMPLETED(false),
    CHECKED_IN(true),
    ;

    companion object {
        fun fromString(status: String): ReservationStatus = valueOf(status.trim().uppercase())
    }
}
