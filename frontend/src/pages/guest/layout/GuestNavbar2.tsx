import {styled, Tab, Tabs} from "@mui/material";
import {SyntheticEvent, useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";

const PillTabs = styled(Tabs)(({ theme }) => {
  return ({
    positon: "relative",
    borderRadius: "9999px",
    border: `1px solid ${theme.palette.divider}`,
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
  fontSize: "16px",
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
  "&.Mui-selected": {
    color: theme.palette.primary.contrastText,
  },
}));

const tabs = [
  {name: "Available Services", link: "/services/available"},
  {name: "Booked Services", link: "/services/requested"},
  {name: "Historical Services", link: "/services/history"},
];

function GuestNavbar2() {
  const currentPath = window.location.pathname;
  console.log(currentPath);
  const [value, setValue] = useState(tabs.map((tab) => tab.link).indexOf(currentPath) ?? 0);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const currentPath = window.location.pathname;
    setValue(tabs.map((tab) => tab.link).indexOf(currentPath))
  }, [location.pathname]);

  const handleChange = (_e: SyntheticEvent, newValue: number) => {
    setValue(newValue);
    navigate(tabs[newValue].link);
  };

  return (
    <PillTabs
      id="pill-tabs-container"
      value={value}
      onChange={handleChange}
      slotProps={{ indicator: {children: <span className="MuiTabs-indicatorSpan" />} }}
      sx={{mb: 2}}
    >
      {tabs.map((tab, index) =>
        <PillTab key={index} disableRipple label={tab.name} />)}
    </PillTabs>
  );
}

export default GuestNavbar2;
