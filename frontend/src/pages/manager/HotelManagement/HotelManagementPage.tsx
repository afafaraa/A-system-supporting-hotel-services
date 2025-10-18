import { useState } from 'react';
import { Box } from '@mui/material';
import SideMenu from './SideMenu';
import RoomsManagementPage from './RoomsManagementPage';
import HotelStructurePage from './HotelStructurePage';
import MenuPage from './MenuPage';
import MaintenancePage from './MaintenancePage';
import FinancePage from './FinancePage';
import { HotelSection } from '../../../types/hotel_sections';
import { SectionCard } from '../../../theme/styled-components/SectionCard';
import AdministrationSettingsPage from './AdministrationSettingsPage';

function HotelManagementPage() {
  const [selectedSection, setSelectedSection] = useState<HotelSection | null>(
    'rooms'
  );

  const renderSection = () => {
    switch (selectedSection) {
      case 'rooms':
        return <RoomsManagementPage />;
      case 'structure':
        return <HotelStructurePage />;
      case 'menu':
        return <MenuPage />;
      case 'maintenance':
        return <MaintenancePage />;
      case 'finance':
        return <FinancePage />;
      case 'settings':
        return <AdministrationSettingsPage />;
      default:
        return null;
    }
  };

  return (
    <SectionCard
      sx={{
        p: 0,
      }}
    >
      <Box display="flex" alignItems="stretch" height="100%">
        <SideMenu active={selectedSection} onSelect={setSelectedSection} />
        <Box flexGrow={1} p={3} minWidth={0}>
          {renderSection()}
        </Box>
      </Box>
    </SectionCard>
  );
}

export default HotelManagementPage;
