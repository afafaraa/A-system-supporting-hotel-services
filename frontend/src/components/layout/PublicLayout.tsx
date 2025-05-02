import {Outlet} from "react-router-dom";
import {Container, useTheme} from "@mui/material";
import DebugNavigationMenu from "../debug/DebugNavigationMenu.tsx";

function PublicLayout() {
  const theme = useTheme();

  return (
    <Container disableGutters maxWidth="xl" sx={{height:"100vh", backgroundColor: theme.palette.secondary.main}}>
        <DebugNavigationMenu />
        <Outlet />
    </Container>
  )
}

export default PublicLayout;