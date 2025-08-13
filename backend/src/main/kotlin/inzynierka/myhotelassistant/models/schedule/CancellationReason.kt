package inzynierka.myhotelassistant.models.schedule

enum class CancellationReason {
    OVERLAPPING_TERMS,
    PERSONAL_REASONS,
    ILLNESS,
    OTHER,
    UNKNOWN,
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
