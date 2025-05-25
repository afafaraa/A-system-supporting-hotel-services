import {Outlet} from "react-router-dom";
import {Container} from "@mui/material";
import Navbar from "./Navbar.tsx";
import DebugNavigationMenu from "../debug/DebugNavigationMenu.tsx";

function AuthenticatedLayout() {
  return (
    <Container disableGutters maxWidth={false} sx={{height: "100vh"}}>
      <DebugNavigationMenu />
      <Navbar>
        <Outlet />
      </Navbar>
    </Container>
  )
}

export default AuthenticatedLayout