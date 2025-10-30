import { useMemo } from "react";
import { Outlet } from "react-router-dom";
import { GlobalStyles, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import DashboardNavbar from "../navigation/DashboardNavbar";
import { useTranslation } from "react-i18next";

const globalStyles = <GlobalStyles styles={{ html: { overflowY: 'scroll' } }} />

function AdminLayout() {
    const { t } = useTranslation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const tabs = useMemo(() => {
    if (isMobile) {
      return [
        { name: t("pages.manager.navbar.guests"), link: "/management/guests" },
        { name: t("pages.manager.navbar.services"), link: "/management/services" },
        { name: t("pages.manager.navbar.employees"), link: "/employees" },
        { name: t("pages.manager.navbar.statistics"), link: "/management/statistics" },
        { name: t("pages.manager.navbar.calendar"), link: "/employee/calendar" },
      ] as const;
    }

    return [
      { name: t("pages.manager.navbar.guests"), link: "/management/guests" },
      { name: t("pages.manager.navbar.services"), link: "/management/services" },
      { name: t("pages.manager.navbar.management"), link: "/management/hotel" },
      { name: t("pages.manager.navbar.employees"), link: "/employees" },
      { name: t("pages.manager.navbar.statistics"), link: "/management/statistics" },
    ] as const;
  }, [t, isMobile]);

    return (
        <>
            {globalStyles}
            <DashboardNavbar tabs={tabs} arrowButtons />
            <Outlet />
        </>
    );
};

export default AdminLayout;