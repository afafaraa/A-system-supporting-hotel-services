import { useMemo } from "react";
import { Outlet } from "react-router-dom";
import { GlobalStyles } from "@mui/material";
import DashboardNavbar from "../navigation/DashboardNavbar";
import { useTranslation } from "react-i18next";

const globalStyles = <GlobalStyles styles={{ html: { overflowY: 'scroll' } }} />

function AdminLayout() {
    const { t } = useTranslation();

    const tabs = useMemo(() => ([
        { name: t("pages.manager.navbar.guests"), link: "/management/guests" },
        { name: t("pages.manager.navbar.services"), link: "/management/services" },
        { name: t("pages.manager.navbar.calendar"), link: "/management/calendar" },
        { name: t("pages.manager.navbar.employees"), link: "/employees" },
        { name: t("pages.manager.navbar.statistics"), link: "/management/statistics" },
    ] as const), [t]);

    return (
        <>
            {globalStyles}
            <DashboardNavbar tabs={tabs} arrowButtons />
            <Outlet />
        </>
    );
};

export default AdminLayout;