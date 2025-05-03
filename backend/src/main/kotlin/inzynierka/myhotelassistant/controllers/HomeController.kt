package inzynierka.myhotelassistant.controllers

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController
import java.security.Principal

@RestController
class HomeController {
    @GetMapping("/")
    fun home(principal: Principal) = "Hello, ${principal.name}!"

    @GetMapping("/secured")
    fun secure() = "This is secured!"

    @GetMapping("/open")
    fun open() = "This is open for everyone without authentication!"
}
