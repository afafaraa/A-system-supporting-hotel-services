package inzynierka.myhotelassistant.models.room

enum class RoomStatus(
    val displayName: String,
) {
    BOOKED("Booked"),
    OPEN("Open"),
    PENDING("Pending"),
    OUT_OF_SERVICE("Out Of Service"),
}
