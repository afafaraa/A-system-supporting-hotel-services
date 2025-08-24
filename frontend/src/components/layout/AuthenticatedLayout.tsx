import {Outlet} from "react-router-dom";
import {Box, Container} from "@mui/material";
import TemporaryMenu from "./TemporaryMenu.tsx";
import Navbar from "./Navbar.tsx";

function AuthenticatedLayout() {

  return (
    <Container disableGutters maxWidth={false} sx={{minHeight: "100vh", height: "100%"}}>
      <Navbar />
      <Box width="100%" height="100%" my={{xs: 3, md: 5}} px={{xs: 1, sm: 2.5, md: 8, lg: 14}}>
        <Outlet />
      </Box>
      <TemporaryMenu />
    </Container>
  )
}

export default AuthenticatedLayout;
