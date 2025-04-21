import {Outlet} from "react-router-dom";
import {Container, useTheme} from "@mui/material";

function PublicLayout({children}){
  const theme = useTheme();

  return (
    <Container disableGutters maxWidth="xl" sx={{height:"100vh", backgroundColor: theme.palette.secondary.main}}>
      <Outlet />
    </Container>
  )
}

export default PublicLayout;