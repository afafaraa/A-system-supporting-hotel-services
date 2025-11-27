import {
  AppBar,
  Badge,
  IconButton,
  Stack,
  Typography,
  useTheme,
  Box,
  Button,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import Logo from '../../assets/hotel.svg?react';
import { useTranslation } from 'react-i18next';
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../../redux/slices/userSlice.ts';
import { Link, useNavigate } from 'react-router-dom';
import ThemeSwitcher from '../ui/ThemeSwitcher.tsx';
import {
  selectUserDetails,
  setUserDetails,
} from '../../redux/slices/userDetailsSlice.ts';
import UserDetails from '../../types/userDetails.ts';
import { useEffect, useState } from 'react';
import { axiosAuthApi } from '../../middleware/axiosApi.ts';
import {
  selectNotificationsCount,
  setNotificationsCount,
} from '../../redux/slices/notificationsCount.ts';
import { selectServicesCartCount } from '../../redux/slices/servicesCartSlice.ts';
import { selectReservationsCartCount } from '../../redux/slices/reservationsCartSlice.ts';
import ShoppingCartPopup from '../../pages/guest/shopping-cart/ShoppingCartPopup.tsx';
import dashboardDestination from '../../utils/dashboardDestination.ts';

const drawerHeight = 64;

function Navbar() {
  const user = useSelector(selectUser);
  const userDetails = useSelector(selectUserDetails);
  const notificationsCount = useSelector(selectNotificationsCount);
  const servicesCartCount = useSelector(selectServicesCartCount);
  const reservationsCartCount = useSelector(selectReservationsCartCount);
  const shoppingCartCount = servicesCartCount + reservationsCartCount;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const { t } = useTranslation();
  const tc = (key: string) => t(`pages.login.${key}`);
  const [shoppingCartOpen, setShoppingCartOpen] = useState<boolean>(false);

  useEffect(() => {
    if (!user) return;
    axiosAuthApi.get<number>('/user/notifications/unread-count').then((res) => {
      if (res.data > 0) dispatch(setNotificationsCount(res.data));
    });
  }, [dispatch, user]);

  useEffect(() => {
    if (userDetails !== null || !user) return;
    axiosAuthApi
      .get<UserDetails>('/user')
      .then((res) => {
        dispatch(setUserDetails(res.data));
      })
      .catch(() => null);
  }, [dispatch, user, userDetails]);

  const getUserInitials = (name: string, surname: string) => {
    return name.charAt(0).toUpperCase() + surname.charAt(0).toUpperCase();
  };

  const AppLogo = () => (
    <Link
      to={user?.role ? dashboardDestination(user.role) : '/home'}
      style={{ textDecoration: 'none' }}
    >
      <Stack direction="row" spacing={2} alignItems="center">
        <Logo
          style={{
            background: theme.palette.primary.main,
            padding: 6,
            color: theme.palette.background.default,
            borderRadius: '20%',
          }}
          width={40}
          height={40}
        />
        <Typography
          fontSize="1.4rem"
          fontWeight="bold"
          color="primary"
          display={{ xs: 'none', sm: 'inherit' }}
        >
          {tc('title')}
        </Typography>
      </Stack>
    </Link>
  );

  const UserCard = () => (
    <Link to="/profile" style={{ textDecoration: 'none' }} data-cy="userCard">
      <Stack direction="row" spacing={2} alignItems="center" px={1}>
        <Box
          fontWeight="bold"
          width={40}
          height={40}
          borderRadius="50%"
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={{
            background: `linear-gradient(315deg,${theme.palette.primary.main} 10%, ${theme.palette.primary.dark} 90%)`,
          }}
        >
          <Typography
            color="primary.contrastText"
            fontWeight="bold"
            lineHeight={1}
            fontSize="0.9rem"
          >
            {userDetails &&
              getUserInitials(userDetails.name, userDetails.surname)}
          </Typography>
        </Box>
        <Stack
          direction="column"
          alignItems="center"
          display={{ xs: 'none', md: 'inherit' }}
        >
          <Typography color="textPrimary" fontWeight="bold" lineHeight={1.3}>
            {userDetails
              ? `${userDetails.name} ${userDetails.surname}`
              : user?.username}
          </Typography>
          <Typography
            color="textSecondary"
            fontWeight="bold"
            fontSize="0.8rem"
            lineHeight={1.3}
          >
            {user?.role === 'ROLE_GUEST' && userDetails
              ? userDetails.guestData?.currentReservation
                ? t('common.room') + ' ' + userDetails.guestData?.currentReservation.roomNumber
                : t('common.without_reservation')
              : user?.role?.split('_')[1]?.toLowerCase()}
          </Typography>
        </Stack>
      </Stack>
    </Link>
  );

  return (
    <>
      <AppBar
        elevation={0}
        position="fixed"
        color="transparent"
        sx={{
          backgroundColor: (theme) =>
            alpha(theme.palette.background.paper, 0.4),
          backdropFilter: 'blur(10px)',
          justifyContent: 'center',
          height: drawerHeight,
          py: 2,
          px: 'max(1rem, calc(13vw - 58.667px))',
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      > {/* padding 16 px to 96 px (sm to xl) */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <AppLogo />

          {user ? (
            <Stack
              direction="row"
              spacing={{ xs: 1.6, sm: 3 }}
              alignItems="center"
            >
              <ThemeSwitcher />

              <IconButton onClick={() => navigate('/notifications')}>
                <Badge badgeContent={notificationsCount} color="primary">
                  <NotificationsOutlinedIcon />
                </Badge>
              </IconButton>

              {user.role === 'ROLE_GUEST' && (
                <IconButton onClick={() => setShoppingCartOpen(true)}>
                  <Badge badgeContent={shoppingCartCount} color="secondary">
                    <ShoppingCartOutlinedIcon />
                  </Badge>
                </IconButton>
              )}

              <UserCard />

              <IconButton onClick={() => navigate('/logout')} data-cy="logoutButton">
                <LogoutOutlinedIcon />
              </IconButton>
            </Stack>
          ) : (
            <Stack direction="row" spacing={2} alignItems="center">
              <ThemeSwitcher />
              <Button
                variant="outlined"
                color="primary"
                onClick={() => navigate('/login')}
                endIcon={<LoginOutlinedIcon />}
              >
                {tc('loginButton')}
              </Button>
            </Stack>
          )}
        </Stack>
      </AppBar>

      <Box sx={{ height: drawerHeight }} />

      {user && (
        <ShoppingCartPopup
          open={shoppingCartOpen}
          closeItself={() => setShoppingCartOpen(false)}
        />
      )}
    </>
  );
}

export default Navbar;
