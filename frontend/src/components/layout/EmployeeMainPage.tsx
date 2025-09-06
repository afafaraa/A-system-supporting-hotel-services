import DashboardNavbar from "../navigation/DashboardNavbar.tsx";
import {Outlet} from "react-router-dom";
import {GlobalStyles} from "@mui/material";


const employeeTabs = [
  {name : "Today", link: "/employee/today-schedules"},
  {name : "Requested", link: "/employee/requested-schedules"},
  {name : "Calendar", link: "/employee/calendar"},
  {name : "Reservation", link: "/employee/reservations"},
  {name : "Reviews", link: "/employee/reviews"},
] as const;

const inputGlobalStyles = <GlobalStyles styles={{ html: { overflowY: 'scroll' } }} />

function EmployeeMainPage() {

  return (
    <>
      {inputGlobalStyles}
      <DashboardNavbar tabs={employeeTabs} />
      <Outlet />
    </>
  )
}

export default EmployeeMainPage;
