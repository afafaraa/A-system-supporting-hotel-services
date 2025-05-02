import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import {Outlet} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, setUser } from "../../redux/slices/userSlice";
import {useNavigate} from "react-router-dom";

const drawerWidth = 240;

interface Props {
  window?: () => Window;
}

function Navbar(props: Props) {
  const { window } = props;
  const user = useSelector(selectUser);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);
  const navigate = useNavigate();

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

  console.log(user)
  const nav = [
    {text: 'Available services', navTo: '' , roles: ['ROLE_ADMIN', 'ROLE_GUEST']},
    {text: 'Shopping cart', navTo: '', roles: ['ROLE_GUEST']},
    {text: 'Requested services', navTo: '', roles: ['ROLE_GUEST']},
    {text: 'Past services', navTo: '', roles: ['ROLE_GUEST']},
    {text: 'Notifications', navTo: '', roles: ['ROLE_GUEST']},
    {text: 'Logout', navTo: '/logout', roles: ['ROLE_GUEST']}
  ]

  const drawer = (
    <div>
      <List>
        {nav.map((item, index) =>
          item.roles.indexOf(user.user.role) >= 0 && <ListItem key={index} disablePadding>
              <ListItemButton onClick={() => navigate(item.navTo)}>
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
    <Box sx={{ display: 'flex' }}>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ display: { sm: 'none' }, mx: '10px' }}
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