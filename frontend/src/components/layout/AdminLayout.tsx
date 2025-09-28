import { useMemo } from "react";
import { Outlet } from "react-router-dom";
import { GlobalStyles } from "@mui/material";
import DashboardNavbar from "../navigation/DashboardNavbar";
import { useTranslation } from "react-i18next";

const globalStyles = <GlobalStyles styles={{ html: { overflowY: 'scroll' } }} />

const tabs = [
  { key: "guests",     link: "/management/guests" },
  { key: "services",   link: "/management/services" },
  { key: "calendar",   link: "/management/calendar" },
  { key: "employees",  link: "/employees" },
  { key: "statistics", link: "/management/statistics" },
] as const;

function AdminLayout() {
  const {t} = useTranslation();
  const translatedTabs = useMemo(() =>
    tabs.map(tab => ({ name: t(`pages.manager.navbar.${tab.key}`), link: tab.link })
  ), [t]);

  return (
    <>
      {globalStyles}
      <DashboardNavbar tabs={translatedTabs} arrowButtons/>
      <Outlet />
    </>
  );
}

export default AdminLayout;