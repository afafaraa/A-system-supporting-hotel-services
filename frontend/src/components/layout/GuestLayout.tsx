import Box from "@mui/material/Box";
import { Outlet } from "react-router-dom";
import NotificationsContainer from "../ui/NotificationsContainer.tsx";
import GlobalStyles from "@mui/material/GlobalStyles";
import DashboardNavbar from "../navigation/DashboardNavbar.tsx";

const inputGlobalStyles = <GlobalStyles styles={{ html: { overflowY: 'scroll' } }} />

const tabs = [
  { name: "Available Services", link: "/guest/available" },
  { name: "Booked Services", link: "/guest/booked" },
  { name: "Book Hotel Room", link: "/guest/hotel" },
]

function GuestLayout() {
  return (
    <div style={{ display: "flex", gap: "1rem" }}>
      <Box sx={{ width: { xs: "100%", md: "70%" } }}>
        {inputGlobalStyles}
        <DashboardNavbar tabs={tabs} />
        <Outlet />
      </Box>
      <Box display={{ xs: "none", md: "block" }} style={{ width: "30%" }}>
        <NotificationsContainer />
      </Box>
    </div>
  );
}

export default GuestLayout;
