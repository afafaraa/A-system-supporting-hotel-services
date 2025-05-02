// components/navigation/NavigationMenu.tsx
import { useState } from 'react';
import { IconButton, Drawer, List, ListItem, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';

const DebugNavigationMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    { text: '/', path: '/' },
    { text: '/login', path: '/login' },
    { text: '/register', path: '/register' },
    { text: '/reset-password-email', path: '/reset-password-email' },
    { text: '/home', path: '/home' },
    { text: '/add-reservation', path: '/add-reservation' },
    { text: '/employees', path: '/employees' },
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
          {menuItems.map((item) => (
            <ListItem
              component="button"
              key={item.text}
              onClick={() => {
                navigate(item.path);
                setIsOpen(false);
              }}
            >
              <ListItemText primary={item.text}/>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
};

export default DebugNavigationMenu;