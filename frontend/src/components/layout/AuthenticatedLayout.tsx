import {Outlet} from "react-router-dom";
import {Container} from "@mui/material";
import Navbar from "./Navbar.tsx";
import HotelAppBar from "./AppBar.tsx";

function AuthenticatedLayout() {

  return (
    <Container disableGutters maxWidth={false} sx={{minHeight: "100vh", height: "100%", px: '30px',
      backgroundColor: "background.default"}}>
      <HotelAppBar />
      <Navbar>
        <Outlet />
      </Navbar>
    </Container>
  )
}

export default AuthenticatedLayout;
