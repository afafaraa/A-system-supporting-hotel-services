import {MouseEvent, useState} from "react";
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/slices/userSlice.ts";
import {useNavigate} from "react-router-dom";
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import HistoryIcon from '@mui/icons-material/History';
import EventNoteIcon from '@mui/icons-material/EventNote';
import MenuIcon from '@mui/icons-material/Menu';
import GroupIcon from '@mui/icons-material/Group';
import BuildIcon from '@mui/icons-material/Build';
import BarChartIcon from '@mui/icons-material/BarChart';
import LanguageSwitcher from "../ui/LanguageSwitcher.tsx";
import {useTranslation} from "react-i18next";
import {Menu, MenuItem, Typography} from "@mui/material";

function TemporaryMenu() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const user = useSelector(selectUser);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const tc = (key: string) => t(`navbar.${key}`);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const nav = [
    {text: tc("availableServices"), icon: DesignServicesIcon, navTo: '/services/available' , roles: ['ROLE_GUEST']},
    {text: tc("requestedServices"), icon: AssignmentTurnedInIcon, navTo: '/services/requested', roles: ['ROLE_GUEST']},
    {text: tc("pastServices"), icon: HistoryIcon, navTo: '/services/history', roles: ['ROLE_GUEST']},
    {text: tc("mySchedule"), icon: EventNoteIcon, navTo: '/employee/schedule', roles: ['ROLE_EMPLOYEE', 'ROLE_RECEPTIONIST', 'ROLE_MANAGER', 'ROLE_ADMIN']},
    {text: tc("personnel"), icon: GroupIcon, navTo: '/employees', roles: ['ROLE_MANAGER', 'ROLE_ADMIN']},
    {text: tc("services"), icon: BuildIcon, navTo: '/management/services', roles: ['ROLE_MANAGER', 'ROLE_ADMIN']},
    {text: tc("stats"), icon: BarChartIcon, navTo: '/management/statistics', roles: ['ROLE_MANAGER', 'ROLE_ADMIN']},
  ]

  const isSelected = (navTo: string): boolean => {
    return location.pathname.startsWith(navTo)
  }

  if (user === null) return null;

  const drawer = (
      nav.map((item, index) =>
        (item.roles === null || item.roles.includes(user.role)) &&
          <MenuItem key={`menu_${index}`} onClick={() => navigate(item.navTo)}
                    sx={{p: 1.5, gap: 2, backgroundColor: isSelected(item.navTo) ? 'primary.main' : 'inherit',
                      '&:hover': {backgroundColor: isSelected(item.navTo) ? 'primary.dark' : 'action.hover'}}}>
            {item.icon && <item.icon sx={{ color: isSelected(item.navTo) ? 'white' : 'primary.main' }}/>}
            <Typography sx={{ color: isSelected(item.navTo) ? 'white' : 'text.primary' }}>{item.text}</Typography>
          </MenuItem>
      )
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <IconButton onClick={handleClick} color="primary"
        sx={{ position: 'fixed', bottom: 4, left: 4, zIndex: 1000 }}>
        <MenuIcon/>
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose} sx={{"& .MuiMenu-list": {py: 0}}}>
        {drawer}
        <MenuItem sx={{p: 1.5}}>
          <LanguageSwitcher />
        </MenuItem>
      </Menu>
    </Box>
  );
}

export default TemporaryMenu;
