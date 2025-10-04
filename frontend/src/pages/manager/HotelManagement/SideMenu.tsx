import { useState } from 'react';
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  IconButton,
  Box,
} from '@mui/material';
import {
  Hotel,
  AccountTree,
  RestaurantMenu,
  Spa,
  Build,
  Payments,
  ChevronLeft,
  ChevronRight,
} from '@mui/icons-material';
import { HotelSection } from '../../../types/hotel_sections';
import SectionTitle from '../../../components/ui/SectionTitle.tsx';
import { HomeOutlined } from '@mui/icons-material';
import { SectionCard } from '../../../theme/styled-components/SectionCard';

interface SideMenuProps {
  active: HotelSection | null;
  onSelect: (section: HotelSection) => void;
}

function SideMenu({ active, onSelect }: SideMenuProps) {
  const [collapsed, setCollapsed] = useState(false);

  const items = [
    { key: 'rooms', label: 'Rooms Management', icon: <Hotel /> },
    { key: 'structure', label: 'Hotel Structure', icon: <AccountTree /> },
    { key: 'menu', label: 'Daily Menu', icon: <RestaurantMenu /> },
    { key: 'facilities', label: 'Hotel Facilities', icon: <Spa /> },
    { key: 'maintenance', label: 'Maintenance', icon: <Build /> },
    { key: 'billing', label: 'Billings & Payments', icon: <Payments /> },
  ] as const;

  return (
    <SectionCard
      sx={{
        borderLeft: 'none',
        borderTop: 'none',
        borderBottom: 'none',
        minWidth: collapsed ? 80 : 250,
        transition: 'all 0.3s ease',
        position: 'relative',
      }}
    >
      {!collapsed && (
        <SectionTitle
          title={
            <>
              <HomeOutlined /> Hotel Management
            </>
          }
          subtitle="Manage Hotel Structures"
          mb={5}
        />
      )}

      {collapsed && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3, mt: 1 }}>
          <HomeOutlined sx={{ color: 'primary.main' }} />
        </Box>
      )}

      <List>
        {items.map((item) => (
          <Tooltip 
            key={item.key} 
            title={collapsed ? item.label : ''} 
            placement="right"
          >
            <ListItemButton
              selected={active === item.key}
              onClick={() => onSelect(item.key as HotelSection)}
              sx={{
                borderRadius: 2,
                mb: 1,
                justifyContent: collapsed ? 'center' : 'flex-start',
                px: collapsed ? 1 : 2,
                '&.Mui-selected': {
                  bgcolor: 'primary.main',
                  color: 'white',
                  '& .MuiListItemIcon-root': { color: 'white' },
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
                },
              }}
            >
              <ListItemIcon 
                sx={{ 
                  minWidth: collapsed ? 'auto' : 56,
                  justifyContent: 'center',
                }}
              >
                {item.icon}
              </ListItemIcon>
              {!collapsed && <ListItemText primary={item.label} />}
            </ListItemButton>
          </Tooltip>
        ))}
      </List>

      <Box
        sx={{
          position: 'absolute',
          top: 35,
          right: 2,
          zIndex: 1,
        }}
      >
        <IconButton
          onClick={() => setCollapsed(!collapsed)}
          sx={{
            bgcolor: 'background.paper',
            width: 32,
            height: 32,
          }}
        >
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </IconButton>
      </Box>
    </SectionCard>
  );
}

export default SideMenu;
