import {Outlet} from "react-router-dom";
import {Container} from "@mui/material";
import {Box} from "@mui/system";
import LanguageSwitcher from "./LanguageSwitcher.tsx";

function PublicLayout() {

  return (
    <Container disableGutters maxWidth={false} sx={{height:"100vh", backgroundColor: 'background.default'}}>
      <Box sx={{position: 'fixed'}}>
        <LanguageSwitcher/>
      </Box>
      <Outlet />
    </Container>
  )
}

export default PublicLayout;