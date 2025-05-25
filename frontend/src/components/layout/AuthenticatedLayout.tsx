import {Outlet} from "react-router-dom";
import {Container} from "@mui/material";
import Navbar from "./Navbar.tsx";
import DebugNavigationMenu from "../debug/DebugNavigationMenu.tsx";
import {useTheme} from '@mui/material';

function AuthenticatedLayout() {
  const theme = useTheme();

  return (
    <Container disableGutters maxWidth={false} sx={{height: "100vh"}}>
      <Navbar>
        <Outlet />
      </Navbar>
    </Container>
  )
}

export default AuthenticatedLayout;
