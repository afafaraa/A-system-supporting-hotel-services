import {styled, Tab, Tabs} from "@mui/material";
import {SyntheticEvent, useMemo} from "react";
import {matchPath, useLocation, useNavigate} from "react-router-dom";

const PillTabs = styled(Tabs)(({ theme }) => {
  return ({
    positon: "relative",
    borderRadius: "9999px",
    border: `1px solid ${theme.palette.primary.border}`,
    backgroundColor: theme.palette.background.paper,
    padding: "4px",
    minHeight: "unset",
    height: "40px",
    "& .MuiTabs-flexContainer": {
      position: "relative",
      zIndex: 1,
      height: "100%",
    },
    "& .MuiTabs-indicator": {
      zIndex: 0,
      pointerEvents: 'none',
      display: "flex",
      justifyContent: "center",
      backgroundColor: "transparent",
      top: 0,
      bottom: 0,
      height: "auto",
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1) 0ms',
    },
    "& .MuiTabs-indicatorSpan": {
      borderRadius: "9999px",
      width: "100%",
      backgroundColor: theme.palette.primary.main,
      boxShadow: theme.shadows[1],
    },
  });
});

const PillTab = styled(Tab)(({ theme }) => ({
  position: "relative",
  zIndex: 1,
  textTransform: "none",
  fontSize: "14px",
  [theme.breakpoints.up("sm")]: {fontSize: "16px",},
  fontWeight: 600,
  flexGrow: 1,
  borderRadius: "9999px",
  minHeight: "100%",
  height: "100%",
  minWidth: 0,
  padding: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: theme.palette.text.primary,
  transition: "color 0.4s ease",
  "&.Mui-selected": {
    color: theme.palette.primary.contrastText,
  },
}));

const tabs = [
  {name: "Available Services", link: "/services/available"},
  {name: "Booked Services", link: "/services/requested"},
  {name: "Historical Services", link: "/services/history"},
];

function GuestNavbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const activeLink = useMemo(() => {
    const match = tabs.find(t =>
      matchPath({ path: `${t.link}/*`, end: false }, location.pathname));
    return match?.link ?? tabs[0].link;
  }, [location.pathname]);

  const handleChange = (_e: SyntheticEvent, newValue: string) => {
    if (newValue !== activeLink) navigate(newValue);
  };

  return (
    <PillTabs
      id="pill-tabs-container"
      value={activeLink}
      variant="fullWidth"
      onChange={handleChange}
      slotProps={{ indicator: {children: <span className="MuiTabs-indicatorSpan" />} }}
      sx={{mb: 2}}
    >
      {tabs.map((tab, index) =>
        <PillTab key={index} value={tab.link} label={tab.name} disableRipple />)}
    </PillTabs>
  );
}

export default GuestNavbar;
