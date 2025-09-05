import {Box, GlobalStyles} from '@mui/material';
import NotificationsContainer from '../../../components/ui/NotificationsContainer.tsx';
import { Outlet } from "react-router-dom";
import DashboardNavbar from "../../../components/navigation/DashboardNavbar.tsx";

const guestTabs = [
  {name: "Available Services", link: "/services/available"},
  {name: "Booked Services", link: "/services/requested"},
  {name: "Historical Services", link: "/services/history"},
] as const;

function GuestMainPage() {

  return (
    <div style={{display: 'flex', gap: '1rem'}}>
      <GlobalStyles styles={{ html: { overflowY: 'scroll' } }} />
      <Box width={{xs: '100%', lg: '70%'}}>
        <DashboardNavbar tabs={guestTabs} />
        <Outlet />
      </Box>
      <Box width='30%' display={{ xs: "none", lg: "block" }}>
        <NotificationsContainer />
      </Box>
    </div>
  )
}

export default GuestMainPage;
