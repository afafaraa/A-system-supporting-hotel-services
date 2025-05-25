import {Outlet} from "react-router-dom";
import {Container} from "@mui/material";
import Navbar from "./Navbar.tsx";

function AuthenticatedLayout() {
  return (
    <Container disableGutters maxWidth="xl" sx={{height: "100vh"}}>
      <Navbar>
        <Outlet />
      </Navbar>
    </Container>
  )
}

export default AuthenticatedLayout;
