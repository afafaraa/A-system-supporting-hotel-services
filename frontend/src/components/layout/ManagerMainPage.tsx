import DashboardNavbar from "../navigation/DashboardNavbar.tsx";
import {Outlet} from "react-router-dom";


const managerTabs = [
  {name : "Guests", link: "/management/guests"},
  {name : "Services", link: "/management/services"},
  {name : "Calendar", link: "/management/calendar"},
  {name : "Personel", link: "/employees"},
  {name : "Statistics", link: "/management/statistics"},
] as const;

function ManagerMainPage() {

  return (
    <>
      <DashboardNavbar tabs={managerTabs} />
      <Outlet />
    </>
  )
}

export default ManagerMainPage;