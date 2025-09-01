import GuestNavbar from "./GuestNavbar.tsx";
import {Box, GlobalStyles} from '@mui/material';
import NotificationsContainer from '../../../components/layout/NotificationsContainer.tsx';
import { Outlet } from "react-router-dom";

function GuestMainPage() {

  return (
    <div style={{display: 'flex', gap: '1rem'}}>
      <GlobalStyles styles={{ html: { overflowY: 'scroll' } }} />
      <Box width={{xs: '100%', lg: '70%'}}>
        <GuestNavbar />
        <Outlet />
      </Box>
      <Box width='30%' display={{ xs: "none", lg: "block" }}>
        <NotificationsContainer />
      </Box>
    </div>
  )
}

export default GuestMainPage;
