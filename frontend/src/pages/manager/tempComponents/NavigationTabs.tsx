import { Tab, Tabs } from "@mui/material";
import { styled } from "@mui/material/styles";

interface NavigationTabsProps {
  activeTab: number;
  onChange: (tab: number) => void;
  tabs: string[];
}

const PillTabs = styled(Tabs)(({ theme }) => ({
  minHeight: "2rem",
  width: "100%",
  "& .MuiTabs-flexContainer": {
    justifyContent: "space-between",
  },
  "& .MuiTabs-indicator": {
    display: "none",
  },
  borderRadius: "2rem",
  backgroundColor: theme.palette.background.paper,
  padding: "0.2rem",
  border: `1px solid ${theme.palette.divider}`,
}));

const PillTab = styled(Tab)(({ theme }) => ({
  textTransform: "none",
  minHeight: "2rem",
  flex: 1,
  borderRadius: "2rem",
  marginRight: theme.spacing(0.5),
  marginLeft: theme.spacing(0.5),
  padding: "0.5rem 0",
  fontWeight: 500,
  fontSize: "0.875rem",
  color: theme.palette.text.primary,
  maxWidth: "none",
  "&.Mui-selected": {
    background: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
}));

function NavigationTabs({ activeTab, onChange, tabs }: NavigationTabsProps) {
  return (
    <PillTabs
      value={activeTab}
      onChange={(_, newValue) => onChange(newValue)}
      variant="scrollable"
      scrollButtons="auto"
    >
      {tabs.map((label, index) => (
        <PillTab key={index} label={label} />
      ))}
    </PillTabs>
  );
}

export default NavigationTabs;
