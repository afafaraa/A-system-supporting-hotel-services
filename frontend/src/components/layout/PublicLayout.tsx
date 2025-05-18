import {Outlet} from "react-router-dom";
import {Container} from "@mui/material";
import DebugNavigationMenu from "../debug/DebugNavigationMenu.tsx";

function PublicLayout() {

  return (
    <Container disableGutters maxWidth="xl" sx={{height:"100vh", backgroundColor: 'background.default'}}>
        <DebugNavigationMenu />
        <Outlet />
    </Container>
  )
}

export default PublicLayout;