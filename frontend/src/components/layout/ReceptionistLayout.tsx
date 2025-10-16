import DashboardNavbar from "../navigation/DashboardNavbar.tsx";
import {Outlet} from "react-router-dom";
import {GlobalStyles} from "@mui/material";
import {useTranslation} from "react-i18next";
import {useMemo} from "react";

const globalStyles = <GlobalStyles styles={{ html: { overflowY: 'scroll' } }} />

const tabs = [
  { key: "arrival-departures",  link: "/receptionist/guest-arrival-and-departures" },
  { key: "reservations",  link: "/receptionist/reservations" },
  { key: "guest-service", link: "/receptionist/guest-service"}
] as const;

function ReceptionistLayout() {
  const {t} = useTranslation();
  const translatedTabs = useMemo(() =>
    tabs.map(tab => ({ name: t("pages.receptionist.navbar." + tab.key), link: tab.link })
    ), [t]);
  return (
    <>
      {globalStyles}
      <DashboardNavbar tabs={translatedTabs} arrowButtons />
      <Outlet />
    </>
  )
}

export default ReceptionistLayout;
