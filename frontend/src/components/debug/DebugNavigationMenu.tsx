// components/navigation/NavigationMenu.tsx
import { useState } from 'react';
import { IconButton, Drawer, List, ListItem, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';

const DebugNavigationMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    '/', '/login', '/logout', '/register', '/reset-password-email',
    '/home', '/add-reservation', '/employees', '/notifications',
    '/services/available', '/services/shopping-cart',
    '/services/history', '/services/requested',
  ];

  const toggleDrawer = (open: boolean) => () => {
    setIsOpen(open);
  };

  return (
    <>
      <IconButton
        aria-label="debug_menu"
        onClick={toggleDrawer(true)}
        sx={{ position: 'fixed', top: '0.5rem', left: '0.5rem', color: 'red'}}
      >
        <MenuIcon />
      </IconButton>

      <Drawer anchor="left" open={isOpen} onClose={toggleDrawer(false)} >
        <List>
          {menuItems.map(item => (
            <ListItem
              component="button"
              key={item}
              onClick={() => {
                navigate(item);
                setIsOpen(false);
              }}
            >
              <ListItemText primary={item}/>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
};

export default DebugNavigationMenu;