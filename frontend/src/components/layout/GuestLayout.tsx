import Box from "@mui/system/Box";
import { Outlet } from "react-router-dom";
import NotificationsContainer from "../ui/NotificationsContainer.tsx";
import GlobalStyles from "@mui/material/GlobalStyles";
import DashboardNavbar from "../navigation/DashboardNavbar.tsx";

const globalStyles = <GlobalStyles styles={{ html: { overflowY: 'scroll' } }} />

const tabs = [
  { name: "Available Services", link: "/guest/available" },
  { name: "Booked Services", link: "/guest/booked" },
  { name: "Book Hotel Room", link: "/guest/hotel" },
]

function GuestLayout() {
  return (
    <div style={{ display: "flex", gap: "1rem" }}>
      <Box width={{ xs: "100%", md: "70%" }}>
        {globalStyles}
        <DashboardNavbar tabs={tabs} />
        <Outlet />
      </Box>
      <Box width="30%" display={{ xs: "none", md: "block" }}>
        <NotificationsContainer />
      </Box>
    </div>
  );
}

export default GuestLayout;
