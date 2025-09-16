import {Outlet} from "react-router-dom";
import {Box, Container} from "@mui/material";
import TemporaryMenu from "../navigation/TemporaryMenu.tsx";
import Navbar from "../navigation/Navbar.tsx";

function AuthenticatedLayout() {

  return (
    <Container disableGutters maxWidth={false} sx={{minHeight: "100dvh", height: "100%"}}>
      <Navbar />
      <Box width="100%" height="100%"
           my="clamp(24px, calc(1.7vw + 13.8px), 40px)"
           px={{ xs: '16px', lg: '160px' }}
      >
        <Outlet />
      </Box>
      <TemporaryMenu />
    </Container>
  )
}

export default AuthenticatedLayout;
