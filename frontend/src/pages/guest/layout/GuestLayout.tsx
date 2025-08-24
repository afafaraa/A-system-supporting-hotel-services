import {Outlet} from "react-router-dom";
import GuestNavbar from "./GuestNavbar.tsx";
import { Box } from '@mui/material';
import NotificationsContainer from '../../../components/layout/NotificationsContainer.tsx';

function GuestLayout() {
  return (
    <div style={{display: 'flex', gap: '1rem'}}>
      <Box sx={{width: { xs: '100%', md: '70%' }}}>
        <GuestNavbar />
        <Outlet />
      </Box>
      <Box display={{ xs: "none", md: "block" }} style={{width:'30%'}}>
        <NotificationsContainer />
      </Box>
    </div>
  )
}

export default GuestLayout;