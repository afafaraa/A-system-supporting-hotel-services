import {SectionCard} from "../../theme/styled-components/SectionCard.ts";
import Box from "@mui/system/Box";
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import SectionTitle from "../../components/ui/SectionTitle.tsx";
import Stack from "@mui/material/Stack";
import {Outlet, useLocation, useNavigate} from "react-router-dom";
import {Typography} from "@mui/material";
import {useMemo} from "react";
import {styled} from "@mui/material/styles";
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined';
import GroupRemoveOutlinedIcon from '@mui/icons-material/GroupRemoveOutlined';

const tabs = [
  { name: "Main",      icon: DashboardOutlinedIcon,   link: "/receptionist/guest-service" },
  { name: "Check-In",  icon: GroupAddOutlinedIcon,    link: "/receptionist/guest-service/check-in" },
  { name: "Check-Out", icon: GroupRemoveOutlinedIcon, link: "/receptionist/guest-service/check-out" },
] as const;

function GuestService() {
  const navigate = useNavigate();
  const location = useLocation();

  const activeLinkIndex = useMemo(() => {
    return tabs.findIndex(t => t.link.startsWith(location.pathname));
  }, [location.pathname]);

  const TabButton = styled(Box)(({ theme }) => ({
    padding: theme.spacing(0.9),
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1.2),
    cursor: "pointer",
    fontWeight: 400,
    "--icon-color": theme.palette.text.secondary,
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
      "--icon-color": theme.palette.primary.main,
      fontWeight: 500,
    },
    "&.active": {
      backgroundColor: theme.palette.action.selected,
      color: theme.palette.text.primary,
      "--icon-color": theme.palette.primary.main,
      fontWeight: 500,
      "&:hover": {
        backgroundColor: theme.palette.action.focus,
      }
    },
    transition: "0.15s ease",
  }));

  return (
    <SectionCard size={0} display="flex" flexDirection="row" alignItems="flex-start">
      <Box p={2} width="20%" alignSelf="stretch" bgcolor="background.default" borderRight="1px solid" borderColor="divider">
        <SectionTitle smaller mb={0} title={<><PersonOutlineOutlinedIcon /> Obsługa gości</>}
                      sx={{display: "flex", flexDirection: "column", alignItems: "center", mt: 1}}/>
        <Stack spacing={1} my={2}>
          {tabs.map((tab, index) => {
            const Icon = tab.icon;
            return (
              <TabButton key={tab.name} onClick={() => navigate(tab.link)}
                         className={activeLinkIndex === index ? "active" : ""}>
                <Icon sx={{fontSize: "150%", color: "var(--icon-color)"}} />
                <Typography fontSize="15px" fontWeight="inherit">{tab.name}</Typography>
              </TabButton>
            );
          })}
        </Stack>
      </Box>
      <Box padding={4} width="100%" fontSize="16px">
        {activeLinkIndex === 0 && <GuestServiceMainPage />}
        <Outlet />
      </Box>
    </SectionCard>
  );
}

function GuestServiceMainPage() {
  return (<>
    <SectionTitle title={<><PersonOutlineOutlinedIcon /> Obsługa gości</>}
                  subtitle={"Wykonaj akcję związaną z obsługą gości"} />
  </>);
}

export default GuestService;
