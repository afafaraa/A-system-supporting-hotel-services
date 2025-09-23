import Box from "@mui/system/Box";
import { Outlet } from "react-router-dom";
import GuestNavbar from "./GuestNavbar.tsx";
import NotificationsContainer from "../../../components/ui/NotificationsContainer.tsx"
import GlobalStyles from "@mui/material/GlobalStyles";

export type PageState = {
  label: string;
  path: string;
};

const subpages = [
  { label: "Available Services", path: "available" },
  { label: "Booked Services", path: "booked" },
  { label: "Book Hotel Room", path: "hotel" },
];

const globalStyles = <GlobalStyles styles={{ html: { overflowY: 'scroll' } }} />

function GuestLayout() {
  return (
    <div style={{ display: "flex", gap: "1rem" }}>
      <Box width={{ xs: "100%", md: "70%" }}>
        {globalStyles}
        <GuestNavbar subpages={subpages} />
        <Outlet />
      </Box>
      <Box width="30%" display={{ xs: "none", md: "block" }}>
        <NotificationsContainer />
      </Box>
    </div>
  );
}

export default GuestLayout;
