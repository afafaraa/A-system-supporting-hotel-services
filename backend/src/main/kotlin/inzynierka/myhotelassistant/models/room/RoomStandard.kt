package inzynierka.myhotelassistant.models.room

enum class RoomStandard(
    val displayName: String,
) {
    BUDGET("Budget"),
    STANDARD("Standard"),
    DELUXE("Deluxe"),
    SUITE("Exclusive Suite"),
}
