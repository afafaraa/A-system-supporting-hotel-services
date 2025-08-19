import {AppBar, IconButton, Stack, Typography, useTheme} from "@mui/material";
import Logo from "../../assets/hotel.svg?react";
import {useTranslation} from "react-i18next";

import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import {useSelector} from "react-redux";
import {selectUser} from "../../redux/slices/userSlice.ts";
import {Box} from "@mui/system";
import {Link, useNavigate} from "react-router-dom";
import ThemeSwitcher from "./ThemeSwitcher.tsx";

export const drawerHeight = 80;

function HotelAppBar() {
  const user = useSelector(selectUser);
  const navigate = useNavigate();

  const theme = useTheme();
  const { t } = useTranslation();
  const tc = (key: string) => t(`pages.login.${key}`);

  if (!user) return null;

  const getUserInitials = (username: string) => {
    const names = username
    return names[0].charAt(0).toUpperCase() + names[1].charAt(0).toUpperCase();
  }

  const AppLogo = () => (
    <Link to="/home" style={{textDecoration: "none"}}>
      <Stack direction="row" spacing={2} alignItems="center">
        <Logo style={{
          backgroundColor: theme.palette.primary.main,
          padding: 8,
          color: theme.palette.background.default,
          borderRadius: '20%'
        }} width={48} height={48}/>
        <Typography variant="h5" fontWeight="bold" color="primary" display={{xs: "none", md: "inherit"}}>
          {tc("title")}
        </Typography>
      </Stack>
    </Link>
  )

  const UserCard = () => (
    <Link to="/home" style={{textDecoration: "none"}}>
      <Stack direction="row" spacing={2} alignItems="center" px={1}>
        <Box bgcolor="primary.main"  fontWeight="bold" width={48} height={48} borderRadius="50%" display="flex"
             alignItems="center"
             justifyContent="center">
          <Typography color="primary.contrastText" fontWeight="bold" lineHeight={1}>
            {getUserInitials(user.username)}
          </Typography>
        </Box>
        <Stack direction="column" alignItems="center" display={{xs: "none", md: "inherit"}}>
          <Typography color="textPrimary" fontWeight="bold">
            {user.username}
          </Typography>
          <Typography color="textSecondary" fontWeight="bold" fontSize="0.8rem">
            {user.role.split("_")[1].toLowerCase()}
          </Typography>
        </Stack>
      </Stack>
    </Link>
  )

  return (
    <>
      <AppBar elevation={1} position="fixed" color="default" sx={{height: drawerHeight, py: 2, px: {xs: 2, sm: 2, md: 7, lg: 12, xl: 12}}}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">

          <AppLogo/>

          <Stack direction="row" spacing={{xs: 0.5, sm: 3}} alignItems="center">

            <ThemeSwitcher />

            <IconButton onClick={() => navigate("/notifications")}>
              <NotificationsOutlinedIcon />
            </IconButton>

            <IconButton onClick={() => navigate("/services/shopping-cart")}>
              <ShoppingCartOutlinedIcon />
            </IconButton>

            <UserCard/>

            <IconButton onClick={() => navigate("/logout")}>
              <LogoutOutlinedIcon />
            </IconButton>

          </Stack>
        </Stack>
      </AppBar>
      <Box sx={{ height: drawerHeight }} />
    </>
  )
}


export default HotelAppBar;
