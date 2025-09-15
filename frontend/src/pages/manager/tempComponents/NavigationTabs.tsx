import { Tab, Tabs } from "@mui/material";
import { styled } from "@mui/material/styles";

interface NavigationTabsProps {
  activeTab: number;
  onChange: (tab: number) => void;
  tabs: string[];
}

const PillTabs = styled(Tabs)(({ theme }) => ({
  minHeight: "2rem",
  "& .MuiTabs-flexContainer": {
    justifyContent: "space-around",
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
  minWidth: "5.5rem",
  borderRadius: "2rem",
  marginRight: theme.spacing(1),
  padding: "0.5rem 5rem",
  fontWeight: 500,
  fontSize: "0.875rem",
  color: theme.palette.text.primary,
  "&.Mui-selected": {
    background: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    padding: "0 5rem",
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
