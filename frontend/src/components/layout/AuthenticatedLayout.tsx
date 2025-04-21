import {Outlet} from "react-router-dom";
import {Container} from "@mui/material";

function AuthenticatedLayout({children}) {
  return (
    <Container disableGutters maxWidth="xl" sx={{height: "100vh"}}>
      <Outlet />
    </Container>
  )
}

export default AuthenticatedLayout