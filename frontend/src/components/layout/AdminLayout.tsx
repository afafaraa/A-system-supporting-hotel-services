import React, { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Container, AppBar } from "@mui/material";
import NavigationTabs from "../../pages/manager/tempComponents/NavigationTabs.tsx";

const AdminLayout: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const tabRoutes: Record<number, string> = {
        0: "/management/guests",
        1: "/management/services",
        2: "/home",
        3: "/employees",
        4: "/management/statistics",
    }

    const tabs: string[] = ["Guests", "Services", "Calendar", "Personnel", "Statistics"];

    const routeToTabIndex = (path: string): number => {
        if (path.startsWith("/management/guests")) return 0;
        if (path.startsWith("/management/services")) return 1;
        if (path.startsWith("/home")) return 2; 
        if (path.startsWith("/employees")) return 3;
        if (path.startsWith("/management/statistics")) return 4;
        return 2;
    };

    
    const [activeTab, setActiveTab] = useState<number>(routeToTabIndex(location.pathname));

    useEffect(() => {
        setActiveTab(routeToTabIndex(location.pathname));
    }, [location.pathname]);

    const handleTabChange = (index: number) => {
        setActiveTab(index);
        navigate(tabRoutes[index]);
    };

    return (
        <Container maxWidth="lg">
            <AppBar position="static" color="transparent" sx={{ boxShadow: "none" }}>
                <NavigationTabs activeTab={activeTab} onChange={handleTabChange} tabs={tabs} />
            </AppBar>
            <Outlet />
        </Container>
    );
};

export default AdminLayout;