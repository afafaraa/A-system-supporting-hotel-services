import { Box } from "@mui/material";
import { Routes, Route, Navigate } from "react-router-dom";
import GuestNavbar from "./GuestNavbar.tsx";
import NotificationsContainer from "../../../components/ui/NotificationsContainer.tsx";
import AvailableServicesPage from "../available-services/AvailableServicesPage.tsx";
import BookedServicesPage from "../booked-services/BookedServicesPage.tsx";
import HotelBookingPage from "../hotel-booking/HotelBookingPage.tsx";

export type PageState = {
  label: string;
  path: string;
};

const subpages = [
  { label: "Available Services", path: "available" },
  { label: "Booked Services", path: "booked" },
  { label: "Book Hotel Room", path: "hotel" },
];

function GuestLayout() {
  return (
    <div style={{ display: "flex", gap: "1rem" }}>
      <Box sx={{ width: { xs: "100%", md: "70%" } }}>
        <GuestNavbar subpages={subpages} />
        <Routes>
          <Route path="available" element={<AvailableServicesPage />} />
          <Route path="booked" element={<BookedServicesPage />} />
          <Route path="hotel" element={<HotelBookingPage />} />
          <Route path="*" element={<Navigate to="available" replace />} />
        </Routes>
      </Box>
      <Box display={{ xs: "none", md: "block" }} style={{ width: "30%" }}>
        <NotificationsContainer />
      </Box>
    </div>
  );
}

export default GuestLayout;
