package inzynierka.myhotelassistant.models.schedule

enum class CancellationReason(val displayName: String) {
    OVERLAPPING_TERMS("Overlapping terms"),
    PERSONAL_REASONS("Personal reasons"),
    ILLNESS("Illness"),
    OTHER("Other"),
    UNKNOWN("Unknown"),
    ;

    companion object {
        fun fromString(value: String): CancellationReason =
            try {
                CancellationReason.valueOf(value.uppercase())
            } catch (_: IllegalArgumentException) {
                UNKNOWN
            }
    }
}
