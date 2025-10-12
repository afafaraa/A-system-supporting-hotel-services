import DashboardNavbar from "../navigation/DashboardNavbar.tsx";
import {Outlet} from "react-router-dom";
import {GlobalStyles} from "@mui/material";
import {useTranslation} from "react-i18next";
import {useMemo} from "react";

const globalStyles = <GlobalStyles styles={{ html: { overflowY: 'scroll' } }} />

const tabs = [
  { key: "today",        link: "/employee/today-schedules" },
  { key: "requested",    link: "/employee/requested-schedules" },
  { key: "calendar",     link: "/employee/calendar" },
  { key: "reviews",      link: "/employee/reviews" },
] as const;

function EmployeeLayout() {
  const {t} = useTranslation();
  const translatedTabs = useMemo(() =>
    tabs.map(tab => ({ name: t(`pages.employee.navbar.${tab.key}`), link: tab.link })
  ), [t]);

  return (
    <>
      {globalStyles}
      <DashboardNavbar tabs={translatedTabs} arrowButtons />
      <Outlet />
    </>
  )
}

export default EmployeeLayout;
