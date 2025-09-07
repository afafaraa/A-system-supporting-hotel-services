import React from "react";
import { Tab, Tabs } from "@mui/material";

interface NavigationTabsProps {
    activeTab: number;
    onChange: (tab: number) => void;
};

const tabs: string[] = ["Guests", "Services", "Calendar", "Personnel", "Statistics"];

const NavigationTabs: React.FC<NavigationTabsProps> = ({ activeTab, onChange }) => {
    return (
        <Tabs 
            value={activeTab} 
            onChange={(_, newValue) => onChange(newValue)}
            centered
            textColor="inherit"
            indicatorColor="primary"
        >
            {tabs.map((label, index) => (
                <Tab key={index} label={label} />
            ))}
        </Tabs>
    );
};

export default NavigationTabs;