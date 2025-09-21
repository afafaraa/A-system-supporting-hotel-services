import { useMemo } from "react";
import { Outlet } from "react-router-dom";
import { GlobalStyles } from "@mui/material";
import DashboardNavbar from "../navigation/DashboardNavbar";
import { useTranslation } from "react-i18next";

const inputGlobalStyles = <GlobalStyles styles={{ html: { overflowY: 'scroll' } }} />

function AdminLayout() {
    const { t } = useTranslation();
    const tc = (key: string) => t(`pages.manager.navbar.${key}`);

    const tabs = useMemo(() => ([
        { name: tc("guests"), link: "/management/guests" },
        { name: tc("services"), link: "/management/services" },
        { name: tc("calendar"), link: "/management/calendar" },
        { name: tc("employees"), link: "/employees" },
        { name: tc("statistics"), link: "/management/statistics" },
    ] as const), [t]);

    return (
        <>
            {inputGlobalStyles}
            <DashboardNavbar tabs={tabs} />
            <Outlet />
        </>
    );
};

export default AdminLayout;