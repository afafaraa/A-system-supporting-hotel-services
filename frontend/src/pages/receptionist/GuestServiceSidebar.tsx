import Box from "@mui/system/Box";
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import Stack from "@mui/material/Stack";
import {IconButton, styled, Tooltip, Typography, useMediaQuery} from "@mui/material";
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import {useState} from "react";
import useTranslationWithPrefix from "../../locales/useTranslationWithPrefix.tsx";
import {useNavigate} from "react-router-dom";
import {TabProp} from "./GuestService.tsx";

const TabButton = styled(Box)(({ theme }) => ({
  padding: theme.spacing(0.9),
  borderRadius: "12px",
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1.2),
  cursor: "pointer",
  fontWeight: 400,
  zIndex: 100,
  "--icon-color": theme.palette.text.secondary,
  "&:hover": {
    backgroundColor: theme.palette.custom.sidebarButtonBg,
    "--icon-color": theme.palette.primary.main,
    fontWeight: 500,
    width: "fit-content",
  },
  "&.active": {
    backgroundColor: theme.palette.action.selected,
    color: theme.palette.text.primary,
    "--icon-color": theme.palette.primary.main,
    fontWeight: 500,
    "&:hover": {
      backgroundColor: theme.palette.custom.sidebarButtonSelectedBg,
    }
  },
  minWidth: "100%",
  transition: "0.15s ease",
}));

interface Props {
  tabs: TabProp[];
  activeTabIndex: number;
}

function GuestServiceSidebar({tabs, activeTabIndex}: Props) {
  const {t: tc} = useTranslationWithPrefix("pages.receptionist.guest-service");
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme => theme.breakpoints.down("sm"));
  const [expanded, setExpanded] = useState<boolean>(!isMobile);

  return (
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
            <Tooltip title={expanded ? null : tab.name} placement="right">
            <TabButton key={tab.name} onClick={() => tab.link && navigate(tab.link)}
                       className={activeTabIndex === index ? "active" : ""}>
              <Icon sx={{fontSize: "24px", color: "var(--icon-color)"}} />
              <Box sx={{overflow: "hidden", textWrap: "nowrap", "&:hover": {overflow: "visible"}}}>
                <Typography fontSize="15px" fontWeight="inherit">{tc(tab.name, {defaultValue: tab.name})}</Typography>
              </Box>
            </TabButton>
            </Tooltip>
          );
        })}
      </Stack>
    </Box>
  );
}

export default GuestServiceSidebar;
