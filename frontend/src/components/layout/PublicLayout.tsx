import {Outlet} from "react-router-dom";
import {Container, Box} from "@mui/material";
import LanguageSwitcher from "../ui/LanguageSwitcher.tsx";
import ThemeSwitcher from "../ui/ThemeSwitcher.tsx";

function PublicLayout() {

  return (
    <Container disableGutters maxWidth={false} sx={{height:"100dvh"}}>
      <Box position="fixed" m={1.5}><LanguageSwitcher/></Box>
      <Box position="fixed" m={1.5} right={0}><ThemeSwitcher/></Box>
      <Box height="inherit" px="10px" display="flex" justifyContent="center" alignItems="center">
        <Outlet />
      </Box>
    </Container>
  )
}

export default PublicLayout;
