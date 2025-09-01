import GuestNavbar from "./GuestNavbar2.tsx";
import {Box, GlobalStyles} from '@mui/material';
import NotificationsContainer from '../../../components/layout/NotificationsContainer.tsx';
import { Outlet } from "react-router-dom";

function GuestMainPage() {

  return (
    <div style={{display: 'flex', gap: '1rem'}}>
      <GlobalStyles styles={{ html: { overflowY: 'scroll' } }} />
      <Box sx={{width: { xs: '100%', md: '70%' }}}>
        <GuestNavbar />
        <Outlet />
      </Box>
      <Box display={{ xs: "none", lg: "block" }} style={{width:'30%'}}>
        <NotificationsContainer />
      </Box>
    </div>
  )
}

export default GuestMainPage;
