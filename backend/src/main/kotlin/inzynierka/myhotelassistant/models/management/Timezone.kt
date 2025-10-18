package inzynierka.myhotelassistant.models.management

enum class Timezone(val zoneId: String, val displayName: String) {
    UTC("UTC", "UTC (Coordinated Universal Time)"),
    GMT_PLUS_1("Europe/Warsaw", "UTC+1 (Central European Time)"),
    GMT_PLUS_2("Europe/Athens", "UTC+2 (Eastern European Time)"),
    EST("America/New_York", "UTC-5 (Eastern Standard Time)"),
    CST("America/Chicago", "UTC-6 (Central Standard Time)"),
    PST("America/Los_Angeles", "UTC-8 (Pacific Standard Time)"),
    GMT("Europe/London", "UTC+0 (Greenwich Mean Time)"),
    CET("Europe/Paris", "UTC+1 (Central European Time)")
}