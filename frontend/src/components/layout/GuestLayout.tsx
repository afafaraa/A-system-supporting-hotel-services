import Box from '@mui/system/Box';
import { Outlet } from 'react-router-dom';
import NotificationsContainer from '../ui/NotificationsContainer.tsx';
import GlobalStyles from '@mui/material/GlobalStyles';
import DashboardNavbar from '../navigation/DashboardNavbar.tsx';
import IssueModal from '../../pages/manager/HotelManagement/IssueModal.tsx';
import { Fab, Tooltip } from '@mui/material';
import { BugReport } from '@mui/icons-material';
import { useState } from 'react';

const subpages = [
  { label: 'Available Services', path: 'available' },
  { label: 'Booked Services', path: 'booked' },
  { label: 'Book Hotel Room', path: 'hotel' },
];

const globalStyles = (
  <GlobalStyles styles={{ html: { overflowY: 'scroll' } }} />
);

function GuestLayout() {
  const [issueModalOpen, setIssueModalOpen] = useState(false);

  const handleOpenIssueModal = () => setIssueModalOpen(true);
  const handleCloseIssueModal = () => setIssueModalOpen(false);
  const handleIssueSaved = () => setIssueModalOpen(false);

  return (
    <>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <Box width={{ xs: '100%', md: '70%' }}>
          {globalStyles}
          <DashboardNavbar
            tabs={subpages.map((s) => ({
              name: s.label,
              link: '/guest/' + s.path,
            }))}
          />
          <Outlet />
        </Box>
        <Box width="30%" display={{ xs: 'none', md: 'block' }}>
          <NotificationsContainer />
        </Box>
      </div>
      <Tooltip title="Report an Issue">
        <Fab
          color="primary"
          aria-label="report-issue"
          onClick={handleOpenIssueModal}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 1500,
            boxShadow: 4,
          }}
        >
          <BugReport />
        </Fab>
      </Tooltip>

      <IssueModal
        open={issueModalOpen}
        issue={null}
        onClose={handleCloseIssueModal}
        onSave={handleIssueSaved}
      />
    </>
  );
}

export default GuestLayout;
