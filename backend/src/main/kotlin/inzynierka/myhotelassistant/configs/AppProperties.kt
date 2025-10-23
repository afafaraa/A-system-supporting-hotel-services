package inzynierka.myhotelassistant.configs

import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.stereotype.Component

@Component
@ConfigurationProperties(prefix = "app")
data class AppProperties(
    var frontend: Frontend = Frontend(),
) {
    data class Frontend(
        var url: String = "http://localhost:5273",
        var port: String = url.split(":").last(),
    )
}
