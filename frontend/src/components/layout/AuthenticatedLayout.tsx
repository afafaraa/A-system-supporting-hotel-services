import {Outlet} from "react-router-dom";
import {Container} from "@mui/material";
import DebugNavigationMenu from "../debug/DebugNavigationMenu.tsx";

function AuthenticatedLayout() {
  return (
    <Container disableGutters maxWidth="xl" sx={{height: "100vh"}}>
        <DebugNavigationMenu />
        <Outlet />
    </Container>
  )
}

export default AuthenticatedLayout