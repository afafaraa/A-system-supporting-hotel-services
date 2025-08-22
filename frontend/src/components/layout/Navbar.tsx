import {AppBar, Badge, IconButton, Stack, Typography, useTheme} from "@mui/material";
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
import {useEffect, useState} from "react";
import {axiosAuthApi} from "../../middleware/axiosApi.ts";

const drawerHeight = 64;

function Navbar() {
  const user = useSelector(selectUser);
  const navigate = useNavigate();
  const [notificationsCount, setNotificationsCount] = useState<number>(0);
  const theme = useTheme();
  const { t } = useTranslation();
  const tc = (key: string) => t(`pages.login.${key}`);

  useEffect(() => {
    axiosAuthApi.get<number>('/user/notifications/unread-count')
      .then(res => {
        if (res.data > 0) setNotificationsCount(res.data);
      });
  }, []);

  if (!user) return null;

  const getUserInitials = (username: string) => {
    if (username.length < 2) return username.toUpperCase();
    return username.charAt(0).toUpperCase() + username.charAt(1).toUpperCase();
  }

  const AppLogo = () => (
    <Link to="/home" style={{textDecoration: "none"}}>
      <Stack direction="row" spacing={2} alignItems="center">
        <Logo style={{
          backgroundColor: theme.palette.primary.main,
          padding: 8,
          color: theme.palette.background.default,
          borderRadius: '20%'
        }} width={40} height={40}/>
        <Typography fontSize="1.4rem" fontWeight="bold" color="primary" display={{xs: "none", md: "inherit"}}>
          {tc("title")}
        </Typography>
      </Stack>
    </Link>
  )

  const UserCard = () => (
    <Link to="/profile" style={{textDecoration: "none"}}>
      <Stack direction="row" spacing={2} alignItems="center" px={1}>
        <Box bgcolor="primary.main"  fontWeight="bold" width={40} height={40} borderRadius="50%" display="flex"
             alignItems="center"
             justifyContent="center">
          <Typography color="primary.contrastText" fontWeight="bold" lineHeight={1} fontSize="0.9rem">
            {getUserInitials(user.username)}
          </Typography>
        </Box>
        <Stack direction="column" alignItems="center" display={{xs: "none", md: "inherit"}}>
          <Typography color="textPrimary" fontWeight="bold" lineHeight={1.3}>
            {user.username}
          </Typography>
          <Typography color="textSecondary" fontWeight="bold" fontSize="0.8rem" lineHeight={1.3}>
            {user.role.split("_")[1].toLowerCase()}
          </Typography>
        </Stack>
      </Stack>
    </Link>
  )

  return (
    <>
      <AppBar elevation={2} position="fixed" color="default" sx={{justifyContent: "center", height: drawerHeight, py: 2, px: {xs: 2, sm: 2, md: 7, lg: 12, xl: 12}}}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">

          <AppLogo/>

          <Stack direction="row" spacing={{xs: 0.5, sm: 3}} alignItems="center">

            <ThemeSwitcher />

            <IconButton onClick={() => navigate("/notifications")}>
              <Badge badgeContent={notificationsCount} color="primary">
                <NotificationsOutlinedIcon />
              </Badge>
            </IconButton>

            {user.role === "ROLE_GUEST" &&
              <IconButton onClick={() => navigate("/services/shopping-cart")}>
                <ShoppingCartOutlinedIcon />
              </IconButton>
            }

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


export default Navbar;
