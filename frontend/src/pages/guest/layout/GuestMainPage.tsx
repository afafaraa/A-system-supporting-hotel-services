import GuestNavbar from "./GuestNavbar.tsx";
import { Box } from '@mui/material';
import NotificationsContainer from '../../../components/layout/NotificationsContainer.tsx';
import { useState } from 'react';
import AvailableServicesPage from '../available-services/AvailableServicesPage.tsx';

const subpages = ["Available Services", "Booked Services", "Book Hotel Room"];

function GuestMainPage() {
  const [currentPage, setCurrentPage] = useState<"Available Services" | "Booked Services" | "Book Hotel Room">("Available Services");
  return (
    <div style={{display: 'flex', gap: '1rem'}}>
      <Box sx={{width: { xs: '100%', md: '70%' }}}>
        <GuestNavbar currentPage={currentPage} setCurrentPage={setCurrentPage} subpages={subpages}/>
        {currentPage === "Available Services" && (
          <AvailableServicesPage />
        )}
        {currentPage === "Booked Services" && (
          <AvailableServicesPage />
        )}
        {currentPage === "Book Hotel Room" && (
          <AvailableServicesPage />
        )}
      </Box>
      <Box display={{ xs: "none", md: "block" }} style={{width:'30%'}}>
        <NotificationsContainer />
      </Box>
    </div>
  )
}

export default GuestMainPage;