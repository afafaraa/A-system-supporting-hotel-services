import {Outlet} from "react-router-dom";
import {Container} from "@mui/material";
import {Box} from "@mui/system";
import LanguageSwitcher from "./LanguageSwitcher.tsx";

function PublicLayout() {

  return (
    <Container disableGutters maxWidth={false} sx={{height:"100vh"}}>
      <Box position="fixed">
        <LanguageSwitcher/>
      </Box>
      <Box height="inherit" px="10px" display="flex" justifyContent="center" alignItems="center">
        <Outlet />
      </Box>
    </Container>
  )
}

export default PublicLayout;
