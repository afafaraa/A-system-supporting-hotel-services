import { useState } from 'react';
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Box,
  Tooltip,
} from '@mui/material';
import {
  Hotel,
  AccountTree,
  RestaurantMenu,
  Settings,
  Build,
  Payments,
  ChevronLeft,
} from '@mui/icons-material';
import { HotelSection } from '../../../types/hotel_sections';
import SectionTitle from '../../../components/ui/SectionTitle.tsx';
import { HomeOutlined } from '@mui/icons-material';
import { SectionCard } from '../../../theme/styled-components/SectionCard';
import { useTranslation } from 'react-i18next';

interface SideMenuProps {
  active: HotelSection | null;
  onSelect: (section: HotelSection) => void;
}

function SideMenu({ active, onSelect }: SideMenuProps) {
  const [collapsed, setCollapsed] = useState(false);
  const { t } = useTranslation();
  const tc = (key: string) => t(`pages.manager.hotel_management.${key}`);

  const items = [
    { key: 'rooms', label: tc('rooms_title'), icon: <Hotel /> },
    { key: 'maintenance', label: tc('maintenance_title'), icon: <Build /> },
    { key: 'settings', label: tc('settings_title'), icon: <Settings /> },
    { key: 'structure', label: tc('structure_title'), icon: <AccountTree /> },
    { key: 'menu', label: tc('menu_title'), icon: <RestaurantMenu /> },
    { key: 'finance', label: tc('finance_title'), icon: <Payments /> },
  ] as const;

  return (
    <SectionCard
      sx={{
        borderLeft: 'none',
        borderTop: 'none',
        borderBottom: 'none',
        minWidth: collapsed ? 80 : 330,
        transition: 'all 0.3s ease',
        position: 'relative',
      }}
    >
      {!collapsed && (
        <SectionTitle
          title={
            <>
              <HomeOutlined /> {tc('title')}
            </>
          }
          subtitle={tc('subtitle')}
          mb={5}
        />
      )}

      {collapsed && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3, mt: 1 }}>
          <IconButton
            onClick={() => setCollapsed(false)}
            sx={{
              transition: 'transform 0.3s ease',
              '&:hover': { transform: 'scale(1.1)' },
            }}
          >
            <HomeOutlined sx={{ color: 'primary.main' }} />
          </IconButton>
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
      {!collapsed && (
        <Box
          sx={{
            position: 'absolute',
            top: '8%',
            right: 5,
            transform: 'translateY(-50%)',
            zIndex: 1,
          }}
        >
          <IconButton
            onClick={() => setCollapsed(true)}
            sx={{
              bgcolor: 'background.paper',
              width: 32,
              height: 32,
              '&:hover': {
                bgcolor: 'action.hover',
              },
            }}
          >
            <ChevronLeft />
          </IconButton>
        </Box>
      )}
    </SectionCard>
  );
}

export default SideMenu;
