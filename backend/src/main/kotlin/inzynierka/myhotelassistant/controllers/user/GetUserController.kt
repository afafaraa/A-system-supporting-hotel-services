package inzynierka.myhotelassistant.controllers.user

import inzynierka.myhotelassistant.models.user.GuestData.BillElement
import inzynierka.myhotelassistant.models.user.UserEntity
import inzynierka.myhotelassistant.services.UserService
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.security.Principal

@RestController
@RequestMapping("/user")
class GetUserController(
    private val userService: UserService,
) {
    @GetMapping
    fun getCurrentUser(principal: Principal): UserEntity = userService.getCurrentUser(principal.name)

    data class UserBill(
        val bill: Double,
        val billElements: List<BillElement>,
    )

    @GetMapping("{userId}/bill")
    @PreAuthorize("hasRole(T(inzynierka.myhotelassistant.models.user.Role).RECEPTIONIST.name)")
    fun getBilling(
        @PathVariable userId: String,
    ) = userService.getUserGuestDataById(userId).let {
        UserBill(
            bill = it.getBill(),
            billElements = it.getBillElements(),
        )
    }
}
