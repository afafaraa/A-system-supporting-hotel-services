import {Outlet} from "react-router-dom";
import {Container} from "@mui/material";
import Navbar from "./Navbar.tsx";

function AuthenticatedLayout() {

  return (
    <Container disableGutters maxWidth={false} sx={{minHeight: "100vh", height: "100%", px: '30px',
      background: "repeating-linear-gradient(218deg, #6BDFDF2E 92%, #073AFF00 100%),repeating-radial-gradient(75% 75% at -41% 230%, #FFF5F512 30%, #CFD9FF14 39%),radial-gradient(99% 99% at 109% 2%, #FBFDFFFF 0%, #073AFF00 100%),radial-gradient(99% 99% at 21% 78%, #D5F9FFFF 0%, #29B4CC00 100%),radial-gradient(160% 154% at 711px -303px, #D6F6FFFF 0%, #FFFFFFFF 100%)"}}>
      <Navbar>
        <Outlet />
      </Navbar>
    </Container>
  )
}

export default AuthenticatedLayout;
