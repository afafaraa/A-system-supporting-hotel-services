import {Outlet} from "react-router-dom";
import {Box, Container} from "@mui/material";
import TemporaryMenu from "./TemporaryMenu.tsx";
import Navbar from "./Navbar.tsx";

function AuthenticatedLayout() {

  return (
    <Container disableGutters maxWidth={false}
    sx={{minHeight: "100vh", height: "100%", backgroundColor: "background.default"}}>
      <Navbar />
      <Box width="100%" height="100%" my={3} px={{xs: 1, sm: 2.5, md: 10, lg: 16}}>
        <Outlet />
      </Box>
      <TemporaryMenu />
    </Container>
  )
}

export default AuthenticatedLayout;
