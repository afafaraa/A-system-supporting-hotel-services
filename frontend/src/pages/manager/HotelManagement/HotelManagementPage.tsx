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
      case 'maintenance':
        return <MaintenancePage />;
      case 'settings':
        return <AdministrationSettingsPage />;
      case 'structure':
        return <HotelStructurePage />;
      case 'menu':
        return <MenuPage />;
      case 'finance':
        return <FinancePage />;
      default:
        return null;
    }
  };

  return (
    <SectionCard size={0} display="flex" alignItems="stretch" height="100%">
        <SideMenu active={selectedSection} onSelect={setSelectedSection} />
        <Box flexGrow={1} p={3} minWidth={0}>
          {renderSection()}
        </Box>
    </SectionCard>
  );
}

export default HotelManagementPage;
