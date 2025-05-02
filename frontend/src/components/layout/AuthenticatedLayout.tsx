import {Outlet} from "react-router-dom";
import {Container} from "@mui/material";
import Navbar from "./Navbar.tsx";
import DebugNavigationMenu from "../debug/DebugNavigationMenu.tsx";

function AuthenticatedLayout() {
  return (
    <Container disableGutters maxWidth="xl" sx={{height: "100vh"}}>
      <Navbar>
        <Outlet />
      </Navbar>
        <DebugNavigationMenu />
        <Outlet />
    </Container>
  )
}

export default AuthenticatedLayout