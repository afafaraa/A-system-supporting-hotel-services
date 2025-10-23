import {SectionCard} from "../../theme/styled-components/SectionCard.ts";
import Box from "@mui/system/Box";
import {Outlet, useLocation} from "react-router-dom";
import {useMemo} from "react";
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined';
import RoomServiceOutlinedIcon from '@mui/icons-material/RoomServiceOutlined';
import GuestServiceMainPage from "./GuestServiceMainPage.tsx";
import GuestServiceSidebar from "./GuestServiceSidebar.tsx";

export interface TabProp {
  name: string;
  icon: typeof DashboardOutlinedIcon;
  link: string | null;
}

const tabs: TabProp[] = [
  { name: "Main",      icon: DashboardOutlinedIcon,   link: "/receptionist/guest-service" },
  { name: "Check-In",  icon: GroupAddOutlinedIcon,    link: "/receptionist/guest-service/check-in" },
  { name: "Service for guest (not implemented)", icon: RoomServiceOutlinedIcon, link: null }
] as const;

function GuestService() {
  const location = useLocation();

  const activeTabIndex = useMemo(() => {
    return tabs.findIndex(t => t.link?.startsWith(location.pathname));
  }, [location.pathname]);

  return (
    <SectionCard size={0} display="flex" flexDirection="row" alignItems="flex-start">
      <GuestServiceSidebar tabs={tabs} activeTabIndex={activeTabIndex}/>
      <Box padding={4} width="100%" fontSize="16px">
        {activeTabIndex === 0 && <GuestServiceMainPage tabs={tabs} />}
        <Outlet />
      </Box>
    </SectionCard>
  );
}

export default GuestService;
