import {SectionCard} from "../../theme/styled-components/SectionCard.ts";
import Box from "@mui/system/Box";
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import SectionTitle from "../../components/ui/SectionTitle.tsx";
import Stack from "@mui/material/Stack";
import {Outlet, useLocation, useNavigate} from "react-router-dom";
import {IconButton, Typography, useMediaQuery} from "@mui/material";
import {useMemo, useState} from "react";
import {styled} from "@mui/material/styles";
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined';
import RoomServiceOutlinedIcon from '@mui/icons-material/RoomServiceOutlined';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import useTranslationWithPrefix from "../../locales/useTranslationWithPrefix.tsx";

const tabs = [
  { name: "Main",      icon: DashboardOutlinedIcon,   link: "/receptionist/guest-service" },
  { name: "Check-In",  icon: GroupAddOutlinedIcon,    link: "/receptionist/guest-service/check-in" },
  { name: "Service for guest (not implemented)", icon: RoomServiceOutlinedIcon, link: null }
] as const;

function GuestService() {
  const {t: tc} = useTranslationWithPrefix("pages.receptionist.guest-service");
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme => theme.breakpoints.down("sm"));
  const [expanded, setExpanded] = useState<boolean>(!isMobile);

  const activeLinkIndex = useMemo(() => {
    return tabs.findIndex(t => t.link?.startsWith(location.pathname));
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
      <Box py={2} px={expanded ? 2 : 1} width={expanded ? "250px" : "56.8px"} alignSelf="stretch" bgcolor="background.default" borderRight="1px solid" borderColor="divider"
           sx={{transition: "width 0.5s ease, padding 0.5s ease"}} flexShrink={0}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Box sx={{
            display: "grid",
            gridTemplateColumns: expanded ? "1fr" : "0fr",
            transition: "grid-template-columns 0.5s ease",
            overflow: "hidden",
            fontSize: "1.2rem",
            textWrap: "nowrap",
          }}>
            <Box component="span" display="flex" alignItems="center" gap={1}><PersonOutlineOutlinedIcon /> {tc("title")}</Box>

          </Box>
          <IconButton onClick={() => setExpanded(prev => !prev)}
                      sx={{transform: expanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.5s ease"}}>
            <ChevronRightIcon />
          </IconButton>
        </Stack>
        <Stack spacing={1} my={2}>
          {tabs.map((tab, index) => {
            const Icon = tab.icon;
            return (
              <TabButton key={tab.name} onClick={() => tab.link && navigate(tab.link)}
                         className={activeLinkIndex === index ? "active" : ""}>
                <Icon sx={{fontSize: "24px", color: "var(--icon-color)"}} />
                <div style={{overflow: "hidden", textWrap: "nowrap"}}>
                  <Typography fontSize="15px" fontWeight="inherit">{tc(tab.name, {defaultValue: tab.name})}</Typography>
                </div>
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
  const navigate = useNavigate();
  const {t: tc} = useTranslationWithPrefix(("pages.receptionist.guest-service"));

  const NavBlock = ({label, icon, onClick}: {label: string, icon: typeof tabs[0]["icon"], onClick: () => void}) => {
    const Icon = icon;
    return (
      <SectionCard clickable size={2} onClick={onClick} minWidth="200px">
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" gap={1}>
          <Icon sx={{fontSize: "300%"}} color="primary" />
          <Typography fontSize="18px" fontWeight={500} color="text.primary" textAlign="center">{label}</Typography>
        </Box>
      </SectionCard>
    );
  }

  return (<>
    <SectionTitle title={<><PersonOutlineOutlinedIcon /> {tc("title")}</>}
                  subtitle={tc("subtitle")} />
    <Stack mt={1} direction="row" flexWrap="wrap" gap={2} mb={2} justifyContent="center"
           display="grid" gridTemplateColumns="repeat(auto-fit, minmax(200px, 1fr))">
      {tabs.map(tab => (
        <NavBlock key={tab.name} label={tc(tab.name, {defaultValue: tab.name})} icon={tab.icon} onClick={() => tab.link && navigate(tab.link)} />
      ))}
    </Stack>
  </>);
}

export default GuestService;
