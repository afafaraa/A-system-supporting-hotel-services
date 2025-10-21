package inzynierka.myhotelassistant.models.service

enum class ServiceType {
    PLACE_RESERVATION,
    GENERAL_SERVICE,
    DINNING,
    SELECTION, // selection from predefined options (e.g., spa treatments, massages)
    DATE_BOOKING, // booking for a specific date (e.g., event tickets, tours)
    GLOBAL, // services for all guests (e.g., breakfast, dinner)
    REQUEST_ON_DEMAND, // request service on demand (e.g., room cleaning, laundry, taxi)
    CUSTOM, // custom service with user-defined fields
}
