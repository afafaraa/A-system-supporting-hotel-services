import { useState } from 'react';
import { Box } from '@mui/material';
import SideMenu from './SideMenu';
import RoomsManagementPage from './RoomsManagementPage';
import HotelStructurePage from './HotelStructurePage';
import MenuPage from './MenuPage';
import HotelFacilitiesPage from './HotelFacilitesPage';
import MaintenancePage from './MaintenancePage';
import { HotelSection } from '../../../types/hotel_sections';
import { SectionCard } from '../../../theme/styled-components/SectionCard';

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
      case 'facilities':
        return <HotelFacilitiesPage />;
      case 'maintenance':
        return <MaintenancePage />;
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