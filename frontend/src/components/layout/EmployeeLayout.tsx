import DashboardNavbar from "../navigation/DashboardNavbar.tsx";
import {Outlet} from "react-router-dom";
import {GlobalStyles} from "@mui/material";
import {useTranslation} from "react-i18next";
import {useMemo} from "react";

const inputGlobalStyles = <GlobalStyles styles={{ html: { overflowY: 'scroll' } }} />

function EmployeeLayout() {
  const {t} = useTranslation();

  const tabs = useMemo(() => ([
    { name: t("pages.employee.navbar.today"),        link: "/employee/today-schedules" },
    { name: t("pages.employee.navbar.requested"),    link: "/employee/requested-schedules" },
    { name: t("pages.employee.navbar.calendar"),     link: "/employee/calendar" },
    { name: t("pages.employee.navbar.reservations"), link: "/employee/reservations" },
    { name: t("pages.employee.navbar.reviews"),      link: "/employee/reviews" },
  ] as const), [t]);

  return (
    <>
      {inputGlobalStyles}
      <DashboardNavbar tabs={tabs} arrowButtons />
      <Outlet />
    </>
  )
}

export default EmployeeLayout;
