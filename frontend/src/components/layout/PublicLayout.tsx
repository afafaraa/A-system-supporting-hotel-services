import { Outlet } from 'react-router-dom';
import { Container, Box } from '@mui/material';
// import LanguageSwitcher from "../ui/LanguageSwitcher.tsx";
import ThemeSwitcher from '../ui/ThemeSwitcher.tsx';
import Navbar from '../navigation/Navbar.tsx';

function PublicLayout({ navbar }: { navbar: boolean }) {
  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      {/*<Box position="fixed" sx={{margin: '90px 30px '}}><LanguageSwitcher/></Box>*/}
      {!navbar && (
        <Box position="fixed" m={1.5} right={0}>
          <ThemeSwitcher />
        </Box>
      )}
      {navbar && <Navbar />}
      <Box
        sx={{
          height: 'inherit',
          display: 'flex',
          justifyContent: navbar ? '' : 'center',
          alignItems: navbar ? '' : 'center',
        }}
      >
        <Outlet />
      </Box>
    </Container>
  );
}

export default PublicLayout;
