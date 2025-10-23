package inzynierka.myhotelassistant.controllers

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import inzynierka.myhotelassistant.configs.RSAKeyConfig
import inzynierka.myhotelassistant.configs.SecurityConfig
import inzynierka.myhotelassistant.controllers.management.MaintenanceController
import inzynierka.myhotelassistant.controllers.management.SettingsController
import inzynierka.myhotelassistant.models.management.IssueStatus
import inzynierka.myhotelassistant.models.management.SystemSettingsEntity
import inzynierka.myhotelassistant.models.room.RoomEntity
import inzynierka.myhotelassistant.models.room.RoomStandardEntity
import inzynierka.myhotelassistant.models.room.RoomStatus
import inzynierka.myhotelassistant.services.RoomService
import inzynierka.myhotelassistant.services.TokenService
import inzynierka.myhotelassistant.services.UserService
import inzynierka.myhotelassistant.services.management.MaintenanceService
import inzynierka.myhotelassistant.services.management.SettingsService
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.mockito.BDDMockito.given
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest
import org.springframework.context.annotation.Import
import org.springframework.http.MediaType
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.userdetails.User
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.security.test.context.support.WithMockUser
import org.springframework.test.context.bean.override.mockito.MockitoBean
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import java.time.LocalDate
import java.time.LocalDateTime

@WebMvcTest(
    SettingsController::class,
    MaintenanceController::class,
    RoomController::class,
)
@Import(SecurityConfig::class, RSAKeyConfig::class, TokenService::class)
class ManagementControllersTest {
    @Autowired
    private lateinit var mvc: MockMvc

    @Autowired
    private lateinit var passwordEncoder: PasswordEncoder

    @MockitoBean
    private lateinit var userService: UserService

    @MockitoBean
    private lateinit var settingsService: SettingsService

    @MockitoBean
    private lateinit var maintenanceService: MaintenanceService

    @MockitoBean
    private lateinit var roomService: RoomService

    private val mapper = jacksonObjectMapper()

    @BeforeEach
    fun setup() {
        val manager =
            User
                .withUsername("manager")
                .password(passwordEncoder.encode("password"))
                .authorities(listOf(SimpleGrantedAuthority("ROLE_MANAGER")))
                .build()

        given(userService.loadUserByUsername("manager")).willReturn(manager)
    }

    @Test
    @WithMockUser(roles = ["MANAGER"])
    fun getSettingsWhenAuthorizedThenReturnsSettings() {
        val settings =
            SystemSettingsEntity(
                id = "default_settings",
                hotelName = "Grand Hotel",
                address = "ExampleStreet 123, Kraków",
                phoneNumber = "1234567890",
                email = "example@gmail.com",
                timezone = "Europe/Warsaw",
                defaultLanguage = "EN",
            )

        given(settingsService.getSettings()).willReturn(settings)

        mvc
            .perform(get("/settings"))
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.hotelName").value("Grand Hotel"))
            .andExpect(jsonPath("$.timezone").value("Europe/Warsaw"))
    }

    @Test
    fun getSettingsWhenNotAuthorizedThen401() {
        mvc
            .perform(get("/settings"))
            .andExpect(status().isUnauthorized)
    }

    @Test
    @WithMockUser(roles = ["MANAGER"])
    fun updateSettingsWhenValidRequestThenReturnSettings() {
        val updatedSettings =
            SystemSettingsEntity(
                id = "default_settings",
                hotelName = "Updated Hotel",
                address = "ExampleStreet 123, Kraków",
                phoneNumber = "1234567890",
                email = "example@gmail.com",
                timezone = "Europe/London",
                defaultLanguage = "PL",
            )

        given(settingsService.updateSettings(updatedSettings)).willReturn(updatedSettings)

        mvc
            .perform(put("/settings").contentType(MediaType.APPLICATION_JSON).content(mapper.writeValueAsString(updatedSettings)))
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.hotelName").value("Updated Hotel"))
    }

    @Test
    @WithMockUser(roles = ["MANAGER"])
    fun getAvailableRoomsThenReturnsList() {
        val issues =
            listOf(
                MaintenanceController.IssueResponse(
                    id = "1",
                    title = "Broken AC",
                    description = "AC not working",
                    roomNumber = "101",
                    status = "REPORTED",
                    reportedBy = "guest123",
                    assignedTo = null,
                    reportedDate = LocalDateTime.now(),
                ),
            )

        given(maintenanceService.getAllIssues()).willReturn(issues)

        mvc
            .perform(get("/maintenance"))
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.length()").value(1))
            .andExpect(jsonPath("$[0].title").value("Broken AC"))
    }

    @Test
    @WithMockUser(roles = ["MANAGER"])
    fun getIssueByIdWhenExistsThenReturnsIssue() {
        val issue =
            MaintenanceController.IssueResponse(
                id = "1",
                title = "Leaking pipe",
                description = "Bathroom pipe leaking",
                roomNumber = "205",
                status = "IN_PROGRESS",
                reportedBy = "manager",
                assignedTo = "employee1",
                reportedDate = LocalDateTime.now(),
            )

        given(maintenanceService.getIssue("1")).willReturn(issue)

        mvc
            .perform(get("/maintenance/1"))
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.title").value("Leaking pipe"))
            .andExpect(jsonPath("$.assignedTo").value("employee1"))
    }

    @Test
    @WithMockUser(roles = ["MANAGER"])
    fun createIssueWhenValidRequestThenReturnsCreatedIssue() {
        val request =
            MaintenanceController.IssueRequest(
                title = "Window broken",
                description = "Window cannot close",
                roomNumber = "303",
                reportedBy = "manager",
            )

        val response =
            MaintenanceController.IssueResponse(
                id = "2",
                title = request.title,
                description = request.description,
                roomNumber = request.roomNumber,
                status = "REPORTED",
                reportedBy = request.reportedBy,
                assignedTo = null,
                reportedDate = LocalDateTime.now(),
            )

        given(maintenanceService.createIssue(request)).willReturn(response)

        mvc
            .perform(
                post("/maintenance")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(mapper.writeValueAsString(request)),
            ).andExpect(status().isOk)
            .andExpect(jsonPath("$.title").value("Window broken"))
            .andExpect(jsonPath("$.status").value("REPORTED"))
    }

    @Test
    @WithMockUser(roles = ["MANAGER"])
    fun assignIssueToEmployeeThenReturnsUpdatedIssue() {
        val issue =
            MaintenanceController.IssueResponse(
                id = "1",
                title = "Fix TV",
                description = "TV remote not working",
                roomNumber = "104",
                status = "IN_PROGRESS",
                reportedBy = "manager",
                assignedTo = "employee2",
                reportedDate = LocalDateTime.now(),
            )

        given(maintenanceService.assignIssue("1", "employee2")).willReturn(issue)

        mvc
            .perform(put("/maintenance/1/assign/employee2"))
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.assignedTo").value("employee2"))
    }

    @Test
    @WithMockUser(roles = ["MANAGER"])
    fun changeIssueStatusThenReturnsUpdatedIssue() {
        val issue =
            MaintenanceController.IssueResponse(
                id = "1",
                title = "Fix door",
                description = "Door lock broken",
                roomNumber = "201",
                status = "RESOLVED",
                reportedBy = "manager",
                assignedTo = "employee1",
                reportedDate = LocalDateTime.now(),
            )

        given(maintenanceService.changeIssueStatus("1", IssueStatus.RESOLVED)).willReturn(issue)

        mvc
            .perform(put("/maintenance/1/status/RESOLVED"))
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.status").value("RESOLVED"))
    }

    @Test
    @WithMockUser(roles = ["MANAGER"])
    fun getIssuesByStatusThenReturnsFilteredList() {
        val issues =
            listOf(
                MaintenanceController.IssueResponse(
                    id = "1",
                    title = "Issue 1",
                    description = "Desc 1",
                    roomNumber = "101",
                    status = "IN_PROGRESS",
                    reportedBy = "manager",
                    assignedTo = "employee1",
                    reportedDate = LocalDateTime.now(),
                ),
            )

        given(maintenanceService.getIssueByStatus(IssueStatus.IN_PROGRESS)).willReturn(issues)

        mvc
            .perform(get("/maintenance/status/IN_PROGRESS"))
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.length()").value(1))
    }

    @Test
    @WithMockUser(roles = ["MANAGER"])
    fun deleteIssueThenReturnsSuccess() {
        mvc
            .perform(delete("/maintenance/1"))
            .andExpect(status().isOk)
    }

    @Test
    @WithMockUser(roles = ["MANAGER"])
    fun getAllRoomsWhenAuthorizedThenReturnsList() {
        val roomStandard =
            RoomStandardEntity(
                id = "standard1",
                name = "Standard",
                description = "Basic room",
                capacity = 2,
                basePrice = 30.00,
            )

        val rooms =
            listOf(
                RoomEntity(
                    number = "101",
                    floor = 1,
                    capacity = 2,
                    pricePerNight = 45.00,
                    standard = roomStandard,
                    description = "this is test description",
                    roomStatus = RoomStatus.AVAILABLE,
                ),
                RoomEntity(
                    number = "102",
                    floor = 1,
                    capacity = 2,
                    pricePerNight = 45.00,
                    standard = roomStandard,
                    description = "this is test description",
                    roomStatus = RoomStatus.AVAILABLE,
                ),
            )

        given(roomService.findAllRooms()).willReturn(rooms)

        mvc
            .perform(get("/rooms"))
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.length()").value(2))
    }

    @Test
    @WithMockUser(roles = ["MANAGER"])
    fun getAvailableRoomsForDateRangeThenReturnsFilteredList() {
        val roomStandard =
            RoomStandardEntity(
                id = "standard1",
                name = "Standard",
                description = "Basic room",
                capacity = 2,
                basePrice = 30.00,
            )

        val availableRooms =
            listOf(
                RoomEntity(
                    number = "102",
                    floor = 1,
                    capacity = 2,
                    pricePerNight = 45.00,
                    standard = roomStandard,
                    description = "this is test description",
                    roomStatus = RoomStatus.AVAILABLE,
                ),
            )

        val from = LocalDate.now()
        val to = LocalDate.now().plusDays(3)

        given(roomService.findAllAvailableRoomsForDate(from, to)).willReturn(availableRooms)

        mvc
            .perform(
                get("/rooms/available")
                    .param("from", from.toString())
                    .param("to", to.toString()),
            ).andExpect(status().isOk)
            .andExpect(jsonPath("$.length()").value(1))
            .andExpect(jsonPath("$[0].number").value("102"))
    }

    @Test
    @WithMockUser(roles = ["MANAGER"])
    fun getRoomByNumberWhenExistsThenReturnsRoom() {
        val roomStandard =
            RoomStandardEntity(
                id = "standard1",
                name = "Standard",
                description = "Basic room",
                capacity = 2,
                basePrice = 30.00,
            )

        val room =
            RoomEntity(
                number = "201",
                floor = 2,
                capacity = 2,
                pricePerNight = 45.00,
                standard = roomStandard,
                description = "this is test description",
                roomStatus = RoomStatus.AVAILABLE,
            )

        given(roomService.findRoomByNumber("201")).willReturn(room)

        mvc
            .perform(get("/rooms/201"))
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.number").value("201"))
            .andExpect(jsonPath("$.floor").value(2))
    }

    @Test
    @WithMockUser(roles = ["MANAGER"])
    fun createRoomWhenValidRequestThenReturnsCreatedRoom() {
        val roomStandard =
            RoomStandardEntity(
                id = "standard1",
                name = "Standard",
                description = "Basic room",
                capacity = 2,
                basePrice = 30.00,
            )

        val room =
            RoomEntity(
                number = "301",
                floor = 1,
                capacity = 2,
                pricePerNight = 2505.00,
                standard = roomStandard,
                description = "this is test description",
                roomStatus = RoomStatus.AVAILABLE,
            )

        given(roomService.createRoom(room)).willReturn(room)

        mvc
            .perform(
                post("/rooms")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(mapper.writeValueAsString(room)),
            ).andExpect(status().isOk)
            .andExpect(jsonPath("$.number").value("301"))
    }

    @Test
    @WithMockUser(roles = ["MANAGER"])
    fun updateRoomWhenValidRequestThenReturnsUpdatedRoom() {
        val roomStandard =
            RoomStandardEntity(
                id = "standard1",
                name = "Standard",
                description = "Basic room",
                capacity = 2,
                basePrice = 30.00,
            )

        val updatedRoom =
            RoomEntity(
                number = "201",
                floor = 1,
                capacity = 2,
                pricePerNight = 45.00,
                standard = roomStandard,
                description = "this is test description",
                roomStatus = RoomStatus.OUT_OF_SERVICE,
            )

        given(roomService.updateRoom(updatedRoom)).willReturn(updatedRoom)

        mvc
            .perform(
                put("/rooms")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(mapper.writeValueAsString(updatedRoom)),
            ).andExpect(status().isOk)
            .andExpect(jsonPath("$.roomStatus").value("OUT_OF_SERVICE"))
    }

    @Test
    @WithMockUser(roles = ["MANAGER"])
    fun deleteRoomThenReturnsSuccess() {
        mvc
            .perform(delete("/rooms/101"))
            .andExpect(status().isOk)
    }

    @Test
    @WithMockUser(roles = ["MANAGER"])
    fun getAllStandardsThenReturnsList() {
        val standards =
            listOf(
                RoomStandardEntity(
                    id = "standard1",
                    name = "Standard",
                    description = "Basic room",
                    capacity = 2,
                    basePrice = 30.00,
                ),
                RoomStandardEntity(
                    id = "standard2",
                    name = "Deluxe",
                    description = "Luxury room",
                    capacity = 4,
                    basePrice = 40.00,
                ),
            )

        given(roomService.findAllStandards()).willReturn(standards)

        mvc
            .perform(get("/rooms/room-standards"))
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.length()").value(2))
    }

    @Test
    @WithMockUser(roles = ["MANAGER"])
    fun createRoomStandardWhenValidRequestThenReturnsCreated() {
        val standard =
            RoomStandardEntity(
                id = "standard3",
                name = "Exclusive",
                description = "Presidential suite",
                capacity = 5,
                basePrice = 150.00,
            )

        given(roomService.createStandard(standard)).willReturn(standard)

        mvc
            .perform(
                post("/rooms/room-standard")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(mapper.writeValueAsString(standard)),
            ).andExpect(status().isCreated)
            .andExpect(jsonPath("$.name").value("Exclusive"))
    }

    @Test
    @WithMockUser(roles = ["MANAGER"])
    fun deleteRoomStandardThenReturnsSuccess() {
        mvc
            .perform(delete("/rooms/room-standard/standard1"))
            .andExpect(status().isOk)
    }

    @Test
    @WithMockUser(roles = ["MANAGER"])
    fun managerCompleteFlowTest() {
        // 1. Manager checks hotel settings
        val settings =
            SystemSettingsEntity(
                id = "default_settings",
                hotelName = "Test Hotel",
                address = "ExampleStreet 123, Kraków",
                phoneNumber = "1234567890",
                email = "example@gmail.com",
                timezone = "Europe/London",
                defaultLanguage = "PL",
            )
        given(settingsService.getSettings()).willReturn(settings)

        mvc
            .perform(get("/settings"))
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.hotelName").value("Test Hotel"))

        // 2. Manager creates new room standard
        val standard =
            RoomStandardEntity(
                id = "standard1",
                name = "Standard",
                description = "Basic room",
                capacity = 2,
                basePrice = 50.00,
            )
        given(roomService.createStandard(standard)).willReturn(standard)

        mvc
            .perform(
                post("/rooms/room-standard")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(mapper.writeValueAsString(standard)),
            ).andExpect(status().isCreated)

        // 3. Manager creates new room
        val room =
            RoomEntity(
                number = "101",
                floor = 1,
                capacity = 2,
                pricePerNight = 45.00,
                standard = standard,
                description = "this is test description",
                roomStatus = RoomStatus.OUT_OF_SERVICE,
            )
        given(roomService.createRoom(room)).willReturn(room)

        mvc
            .perform(
                post("/rooms")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(mapper.writeValueAsString(room)),
            ).andExpect(status().isOk)

        // 4. Manager reports maintenance issue
        val issueRequest =
            MaintenanceController.IssueRequest(
                title = "AC not working",
                description = "Room 101 AC broken",
                roomNumber = "101",
                reportedBy = "manager",
            )
        val issueResponse =
            MaintenanceController.IssueResponse(
                id = "1",
                title = issueRequest.title,
                description = issueRequest.description,
                roomNumber = issueRequest.roomNumber,
                status = "REPORTED",
                reportedBy = "manager",
                assignedTo = null,
                reportedDate = LocalDateTime.now(),
            )
        given(maintenanceService.createIssue(issueRequest)).willReturn(issueResponse)

        mvc
            .perform(
                post("/maintenance")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(mapper.writeValueAsString(issueRequest)),
            ).andExpect(status().isOk)
            .andExpect(jsonPath("$.status").value("REPORTED"))
    }
}
