import DashboardNavbar from "../navigation/DashboardNavbar.tsx";
import {Outlet} from "react-router-dom";
import {GlobalStyles} from "@mui/material";

const globalStyles = <GlobalStyles styles={{ html: { overflowY: 'scroll' } }} />

const tabs = [
  { name: "Arrival and Departures",  link: "/receptionist/guest-arrival-and-departures" },
  { name: "Reservations",  link: "/receptionist/reservations" },
  { name: "Guest service", link: "/receptionist/guest-service"}
] as const;

function ReceptionistLayout() {
  return (
    <>
      {globalStyles}
      <DashboardNavbar tabs={tabs} arrowButtons />
      <Outlet />
    </>
  )
}

export default ReceptionistLayout;
