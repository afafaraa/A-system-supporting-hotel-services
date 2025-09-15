import GuestNavbar from "./GuestNavbar.tsx";
import { Box } from '@mui/material';
import NotificationsContainer from '../../../components/ui/NotificationsContainer.tsx';
import { useState } from 'react';
import AvailableServicesPage from '../available-services/AvailableServicesPage.tsx';
import BookedServicesPage from '../booked-services/BookedServicesPage.tsx';
import HotelBookingPage from '../hotel-booking/HotelBookingPage.tsx';

export type PageState = "Available Services" | "Booked Services" | "Book Hotel Room";

const subpages: PageState[] = ["Available Services", "Booked Services", "Book Hotel Room"];

function GuestLayout() {
  const [currentPage, setCurrentPage] = useState<PageState>("Available Services");
  return (
    <div style={{display: 'flex', gap: '1rem'}}>
      <Box sx={{width: { xs: '100%', md: '70%' }}}>
        <GuestNavbar currentPage={currentPage} setCurrentPage={setCurrentPage} subpages={subpages}/>
        {currentPage === "Available Services" && (
          <AvailableServicesPage />
        )}
        {currentPage === "Booked Services" && (
          <BookedServicesPage />
        )}
        {currentPage === "Book Hotel Room" && (
          <HotelBookingPage />
        )}
      </Box>
      <Box display={{ xs: "none", md: "block" }} style={{width:'30%'}}>
        <NotificationsContainer />
      </Box>
    </div>
  )
}

export default GuestLayout;
