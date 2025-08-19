import {Outlet} from "react-router-dom";
import {Container, useTheme} from "@mui/material";
import Navbar from "./Navbar.tsx";
import HotelAppBar from "./AppBar.tsx";

function AuthenticatedLayout() {
  const theme = useTheme();

  const background = theme.palette.mode === 'light' ?
    "repeating-linear-gradient(218deg, #9B69DB2E 92%, #073AFF00 100%),repeating-radial-gradient(75% 75% at -41% 230%, #FFF5F512 30%, #CFD9FF14 39%),radial-gradient(99% 99% at 109% 2%, #FBFDFFFF 0%, #073AFF00 100%),radial-gradient(99% 99% at 21% 78%, #F5EEFEFF 0%, #29B4CC00 100%),radial-gradient(160% 154% at 711px -303px, #7545FBFF 0%, #FFFFFFFF 100%)"
    :
    "repeating-linear-gradient(218deg, #5424942E 92%, #073AFF00 100%),repeating-radial-gradient(75% 75% at -41% 230%, #FFF5F512 30%, #CFD9FF14 39%),radial-gradient(99% 99% at 109% 2%, #FBFDFF00 0%, #073AFF00 100%),radial-gradient(99% 99% at 21% 78%, #F5EEFE00 0%, #29B4CC00 100%),radial-gradient(160% 154% at 711px -303px, #3404b9FF 0%, #000000FF 100%)";


  return (
    <Container disableGutters maxWidth={false} sx={{minHeight: "100vh", height: "100%", px: '30px',
      background: background}}>
      <HotelAppBar />
      <Navbar>
        <Outlet />
      </Navbar>
    </Container>
  )
}

export default AuthenticatedLayout;
