import {Outlet} from "react-router-dom";
import {Box, Container} from "@mui/material";
import Navbar from "./Navbar.tsx";
import HotelAppBar from "./AppBar.tsx";

function AuthenticatedLayout() {

  return (
    <Container disableGutters maxWidth={false}
    sx={{minHeight: "100vh", height: "100%", backgroundColor: "background.default"}}>
      <HotelAppBar />
      <Navbar>
        <Box width="100%" height="100%" my={3} px={{xs: 1, sm: 2.5, md: 4}}>
          <Outlet />
        </Box>
      </Navbar>
    </Container>
  )
}

export default AuthenticatedLayout;
