package inzynierka.myhotelassistant.models.service


enum class ServiceType() {
    SELECTION,             // selection from predefined options (e.g., spa treatments, massages)
    DATE_BOOKING,          // booking for a specific date (e.g., event tickets, tours)
    PLACE_RESERVATION,     // reservation of a place (e.g., court, ping pong table)
    GLOBAL,                // services for all guests (e.g., breakfast, dinner)
    REQUEST_ON_DEMAND,     // request service on demand (e.g., room cleaning, laundry, taxi)
    CUSTOM,                // custom service with user-defined fields
}
