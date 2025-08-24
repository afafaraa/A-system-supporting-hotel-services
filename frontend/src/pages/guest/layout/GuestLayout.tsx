import {Outlet} from "react-router-dom";
import GuestNavbar from "./GuestNavbar.tsx";
import { Box } from '@mui/material';
import NotificationsContainer from '../../../components/layout/NotificationsContainer.tsx';

function GuestLayout() {
  return (
    <div style={{display: 'flex', gap: '1rem'}}>
      <div style={{width: '70%'}}>
        <GuestNavbar />
        <Outlet />
      </div>
      <div style={{width:'30%'}}>
        <NotificationsContainer />
      </div>
    </div>
  )
}

export default GuestLayout;