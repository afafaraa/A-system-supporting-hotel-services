package inzynierka.myhotelassistant.models.room

enum class RoomStatus(
    val displayName: String,
) {
    AVAILABLE("Available"),
    OUT_OF_SERVICE("Out Of Service"),
}
