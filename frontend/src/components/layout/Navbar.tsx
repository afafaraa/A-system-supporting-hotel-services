import {ReactNode, useState} from "react";
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import {Outlet, useLocation} from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/slices/userSlice";
import {useNavigate} from "react-router-dom";
import HomeIcon from '@mui/icons-material/Home';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import HistoryIcon from '@mui/icons-material/History';
import EventNoteIcon from '@mui/icons-material/EventNote';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import GroupIcon from '@mui/icons-material/Group';
import BuildIcon from '@mui/icons-material/Build';
import BarChartIcon from '@mui/icons-material/BarChart';
import LanguageSwitcher from "./LanguageSwitcher.tsx";
import {useTranslation} from "react-i18next";
import {drawerHeight} from "./AppBar.tsx";

const drawerWidth = 240;

interface Props {
  window?: () => Window;
  children?: ReactNode
}

function Navbar(props: Props) {
  const { window } = props;
  const user = useSelector(selectUser);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const tc = (key: string) => t(`navbar.${key}`);

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  const nav = [
    {text: tc("home"), icon: HomeIcon, navTo: '/home', roles: null},
    {text: tc("availableServices"), icon: DesignServicesIcon, navTo: '/services/available' , roles: ['ROLE_GUEST']},
    {text: tc("shoppingCart"), icon: ShoppingCartIcon, navTo: '/services/shopping-cart', roles: ['ROLE_GUEST']},
    {text: tc("requestedServices"), icon: AssignmentTurnedInIcon, navTo: '/services/requested', roles: ['ROLE_GUEST']},
    {text: tc("pastServices"), icon: HistoryIcon, navTo: '/services/history', roles: ['ROLE_GUEST']},
    {text: tc("mySchedule"), icon: EventNoteIcon, navTo: '/employee/schedule', roles: ['ROLE_EMPLOYEE', 'ROLE_RECEPTIONIST', 'ROLE_MANAGER', 'ROLE_ADMIN']},
    {text: tc("notifications"), icon: NotificationsIcon, navTo: '/notifications', roles: null},
    {text: tc("personnel"), icon: GroupIcon, navTo: '/employees', roles: ['ROLE_MANAGER', 'ROLE_ADMIN']},
    {text: tc("services"), icon: BuildIcon, navTo: '/management/services', roles: ['ROLE_MANAGER', 'ROLE_ADMIN']},
    {text: tc("stats"), icon: BarChartIcon, navTo: '/management/statistics', roles: ['ROLE_MANAGER', 'ROLE_ADMIN']},
    {text: tc("logout"), icon: LogoutIcon, navTo: '/logout', roles: null}
  ]

  const isSelected = (navTo: string): boolean => {
    return location.pathname.startsWith(navTo)
  }

  if (user === null) return null;

  const drawer = (
    <List>
      {nav.map((item, index) =>
        (item.roles === null || item.roles.includes(user.role)) &&
          <ListItem key={index} disablePadding>
              <ListItemButton disableRipple
                  onClick={() => navigate(item.navTo)}
                  sx={{
                    gap: 2, backgroundColor: isSelected(item.navTo) ? 'primary.main' : 'inherit',
                    '&:hover': {
                      backgroundColor: isSelected(item.navTo) ? 'primary.dark' : 'action.hover'
                    } }}
              >
                {item.icon &&
                    <ListItemIcon sx={{ minWidth: 'unset' }}>
                        <item.icon sx={{ color: isSelected(item.navTo) ? 'white' : 'primary.main' }} />
                    </ListItemIcon>
                }
                  <ListItemText primary={item.text} sx={{color: isSelected(item.navTo) ? 'white' : 'text.primary'}}/>
              </ListItemButton>
          </ListItem>
      )}
    </List>
  );

  // Remove this const when copying and pasting into your project.
  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: 'flex' }}>
        <IconButton
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ color: 'white', backgroundColor: 'primary.main', display: { sm: 'none' }, position: 'fixed', top: drawerHeight, left: 0, zIndex: 1000, m: 1 }}
        >
          <MenuIcon/>
        </IconButton>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          slotProps={{
            root: {
              keepMounted: true, // Better open performance on mobile.
            },
          }}
        >
          {drawer}
          <Box sx={{marginTop: 'auto'}}><LanguageSwitcher /></Box>
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, top: drawerHeight+8, height: `calc(100% - ${drawerHeight+8}px)` },
          }}
          open
        >
          {drawer}
          <Box sx={{marginTop: 'auto'}}><LanguageSwitcher /></Box>
        </Drawer>
      </Box>
      <Outlet />
    </Box>
  );
}

export default Navbar;
