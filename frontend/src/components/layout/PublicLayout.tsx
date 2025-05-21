import {Outlet} from "react-router-dom";
import {Container} from "@mui/material";

function PublicLayout() {

  return (
    <Container disableGutters maxWidth="xl" sx={{height:"100vh", backgroundColor: 'background.default'}}>
      <Outlet />
    </Container>
  )
}

export default PublicLayout;