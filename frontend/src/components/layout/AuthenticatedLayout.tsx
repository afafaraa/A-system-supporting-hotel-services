import {Outlet} from "react-router-dom";
import {Container} from "@mui/material";
import Navbar from "./Navbar.tsx";
import DebugNavigationMenu from "../debug/DebugNavigationMenu.tsx";
import {useTheme} from '@mui/material';

function AuthenticatedLayout() {
  const theme = useTheme();

  return (
    <Container disableGutters maxWidth="xl" sx={{height: "fit-content", minHeight: '100vh', backgroundColor: theme.palette.secondary.main}}>
      <DebugNavigationMenu />
      <Navbar>
        <Outlet />
      </Navbar>
        {/*<DebugNavigationMenu />*/}
    </Container>
  )
}

export default AuthenticatedLayout