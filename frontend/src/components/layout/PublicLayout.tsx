import {Outlet} from "react-router-dom";
import {Container} from "@mui/material";
import {Box} from "@mui/system";
import LanguageSwitcher from "./LanguageSwitcher.tsx";

function PublicLayout() {

  return (
    <Container disableGutters maxWidth={false} sx={{height:"100vh",
      background: "repeating-linear-gradient(319deg, #00FFFF2E 92%, #073AFF00 100%),repeating-radial-gradient(75% 75% at 238% 218%, #4dd0e1 29%, #9B9B9B14 39%),radial-gradient(99% 99% at 109% 2%, #b2ebf2 0%, #073AFF00 100%),radial-gradient(99% 99% at 14% 89%, #00bcd4 0%, #073AFF00 100%),radial-gradient(160% 154% at 711px -303px, #FFFFFFFF 0%, #9fa8da 99%)"}}>
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
