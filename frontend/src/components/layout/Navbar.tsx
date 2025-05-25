import {ReactNode, useState} from "react";
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import {Outlet} from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/slices/userSlice";
import {useNavigate} from "react-router-dom";
import {useTheme} from "@mui/material";

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
  const theme = useTheme();

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
    {text: 'Available services', navTo: '/services/available' , roles: ['ROLE_GUEST']},
    {text: 'Shopping cart', navTo: '/services/shopping-cart', roles: ['ROLE_GUEST']},
    {text: 'Requested services', navTo: '/services/requested', roles: ['ROLE_GUEST']},
    {text: 'Past services', navTo: '/services/history', roles: ['ROLE_GUEST']},
    {text: 'Notifications', navTo: '/notifications', roles: ['ROLE_GUEST']},
    {text: 'Logout', navTo: '/logout', roles: null},
  ]

  if (user === null) return null;

  const drawer = (
    <div>
      <List sx={{paddingX: '10px'}}>
        <img alt="Logo"/>
        {nav.map((item, index) =>
          (item.roles === null || item.roles.includes(user.role)) &&
            <ListItem key={index} disablePadding>
              <ListItemButton sx={{marginY: '5px', backgroundColor: theme.palette.secondary.main, borderRadius: '10px', '&:hover': {backgroundColor: theme.palette.secondary.dark,} }}
                onClick={() => navigate(item.navTo)}>
                <ListItemIcon>
                  icon
                </ListItemIcon>
                <ListItemText primary={item.text}/>
              </ListItemButton>
            </ListItem>
        )}
      </List>
    </div>
  );

  // Remove this const when copying and pasting into your project.
  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: 'flex', paddingX: '60px', paddingY: '30px' }}>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ display: { sm: 'none' }, mx: '10px', position: 'absolute' }}
        >
          Menu
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
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Outlet />
    </Box>
  );
}


export default Navbar;