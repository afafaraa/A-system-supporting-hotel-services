package inzynierka.myhotelassistant.configs

import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.context.annotation.Configuration

@Configuration
@ConfigurationProperties(prefix = "app")
class AppProperties {
    lateinit var frontend: Frontend

    class Frontend {
        lateinit var url: String
    }
}
