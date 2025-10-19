import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  CardActions,
  Grid,
  IconButton,
  TextField,
  ClickAwayListener,
  Menu,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Build,
  Add,
  Search,
  MoreVert,
  Edit,
  Delete,
  PersonAdd,
  CheckCircle,
  Room,
  Person,
  CalendarToday,
  Close,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import SectionTitle from '../../../components/ui/SectionTitle';
import { SectionCard } from '../../../theme/styled-components/SectionCard';
import { axiosAuthApi } from '../../../middleware/axiosApi';
import { Issue, IssueStatus, getStatusColor } from '../../../types/maintenance';
import IssueModal from './IssueModal';
import AssignIssueModal from './AssingIssueModal';

function MaintenancePage() {
  const { t } = useTranslation();
  const tc = (key: string) => t(`pages.manager.maintenance.${key}`);

  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchOpen, setSerachOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | IssueStatus>('ALL');
  const [issueModalOpen, setIssueModalOpen] = useState(false);
  const [editingIssue, setEditingIssue] = useState<Issue | null>(null);
  const [assignModalOpen, setAssingModalOpen] = useState(false);
  const [assigningIssue, setAssigningIssue] = useState<Issue | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);

  const fetchIssues = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axiosAuthApi.get<Issue[]>('/maintenance');
      console.log(res.data);
      setIssues(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]);

  const filteredIssues = useMemo(() => {
    const filtered = issues.filter((issue) => {
      const matchesSearch =
        issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.roomNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.description?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === 'ALL' || issue.status === statusFilter;

      return matchesSearch && matchesStatus;
    });

    const statusOrder: Record<IssueStatus, number> = {
      OPEN: 1,
      IN_PROGRESS: 2,
      RESOLVED: 3,
      CLOSED: 4,
    };

    return filtered.sort((a, b) => {
      const statusDiff = statusOrder[a.status] - statusOrder[b.status];
      if (statusDiff !== 0) return statusDiff;

      const dateA = new Date(a.reportedDate).getTime();
      const dateB = new Date(b.reportedDate).getTime();
      return dateB - dateA;
    });
  }, [issues, searchQuery, statusFilter]);

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    issue: Issue
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedIssue(issue);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedIssue(null);
  };

  const handleEditIssue = () => {
    setEditingIssue(selectedIssue);
    setIssueModalOpen(true);
    handleMenuClose();
  };

  const handleAssignIssue = () => {
    setAssigningIssue(selectedIssue);
    setAssingModalOpen(true);
    handleMenuClose();
  };

  const handleDeleteIssue = async () => {
    if (!selectedIssue) return;
    if (!window.confirm('Are you sure you want to delete this issue?')) {
      handleMenuClose();
      return;
    }

    try {
      await axiosAuthApi.delete(`/maintenance/${selectedIssue.id}`);
      fetchIssues();
    } catch (err) {
      console.error(err);
    }
    handleMenuClose();
  };

  const handleChangeStatus = async (issueId: string, status: IssueStatus) => {
    try {
      await axiosAuthApi.put(`/maintenance/${issueId}/status/${status}`);
      fetchIssues();
    } catch (err) {
      console.error(err);
    }
    handleMenuClose();
  };

  const isResolved = (status: IssueStatus) =>
    status === 'RESOLVED' || status === 'CLOSED';

  if (loading) {
    return (
      <SectionCard>
        <CircularProgress />
      </SectionCard>
    );
  }

  return (
    <Box>
      <SectionTitle
        title={
          <>
            <Build /> {tc('title')}
          </>
        }
        subtitle={tc('subtitle')}
        mb={3}
      />

      <SectionCard>
        <Box display="flex" alignItems="center" flexWrap="wrap" gap={2} mb={3}>
          <Typography variant="h6" fontWeight="600">
            Issues List
          </Typography>
          <Box
            display="flex"
            alignItems="center"
            flexWrap="wrap"
            gap={2}
            justifyContent="flex-end"
            flexGrow={1}
          >
            <ClickAwayListener onClickAway={() => setSerachOpen(false)}>
              <Box
                display="grid"
                alignItems="center"
                position="relative"
                gridTemplateColumns={`auto ${searchOpen ? '1fr' : '0fr'}`}
                columnGap={searchOpen ? 1 : 0}
                sx={{
                  transition:
                    'grid-template-columns 0.3s ease, column-gap 0.3s ease',
                }}
              >
                <IconButton onClick={() => setSerachOpen(!searchOpen)}>
                  <Search />
                </IconButton>
                <TextField
                  placeholder={tc('searchPlaceholder')}
                  variant="outlined"
                  size="small"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{
                    visibility: searchOpen ? 'visible' : 'hidden',
                  }}
                  autoFocus
                />
              </Box>
            </ClickAwayListener>

            <FormControl size="small" sx={{ maxWidth: 150 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) =>
                  setStatusFilter(e.target.value as 'ALL' | IssueStatus)
                }
              >
                <MenuItem value="ALL">{tc('all')}</MenuItem>
                <MenuItem value="OPEN">{tc('open')}</MenuItem>
                <MenuItem value="IN_PROGRESS">{tc('inProgress')}</MenuItem>
                <MenuItem value="RESOLVED">{tc('resolved')}</MenuItem>
                <MenuItem value="CLOSED">{tc('closed')}</MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => {
                setEditingIssue(null);
                setIssueModalOpen(true);
              }}
              sx={{ borderRadius: '12px' }}
            >
              {tc('addIssue')}
            </Button>
          </Box>
        </Box>

        <Grid container spacing={1}>
          {filteredIssues.map((issue) => (
            <Grid key={issue.id} size={{ xs: 12, md: 6, lg: 4 }}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  opacity: isResolved(issue.status) ? 0.6 : 1,
                  transition: 'opacity 0.3s ease',
                  '&:hover': {
                    opacity: 1,
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="start"
                    mb={2}
                  >
                    <Typography variant="h6" component="div" fontWeight={600}>
                      {issue.title}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, issue)}
                    >
                      <MoreVert />
                    </IconButton>
                  </Box>

                  <Chip
                    label={issue.status.replace('_', ' ')}
                    color={getStatusColor(issue.status)}
                    size="small"
                    sx={{ mb: 2 }}
                  />

                  <Box display="flex" flexDirection="column" gap={1}>
                    {issue.roomNumber && (
                      <Box display="flex" alignItems="center" gap={1}>
                        <Room fontSize="small" color="action" />
                        <Typography variant="body2" color="text.primary">
                          {tc('room')}: {issue.roomNumber}
                        </Typography>
                      </Box>
                    )}

                    <Box display="flex" alignItems="center" gap={1}>
                      <Person fontSize="small" color="action" />
                      <Typography variant="body2" color="text.primary">
                        {tc('reportedBy')}: {issue.reportedBy}
                      </Typography>
                    </Box>

                    {issue.assignedTo && (
                      <Box display="flex" alignItems="center" gap={1}>
                        <PersonAdd fontSize="small" color="action" />
                        <Typography variant="body2" color="text.primary">
                          {tc('assignedTo')}: {issue.assignedTo}
                        </Typography>
                      </Box>
                    )}

                    {issue.reportedDate && (
                      <Box display="flex" alignItems="center" gap={1}>
                        <CalendarToday fontSize="small" color="action" />
                        <Typography variant="body2" color="text.primary">
                          {tc('reportedDate')}:{' '}
                          {new Date(issue.reportedDate).toLocaleDateString()}
                        </Typography>
                      </Box>
                    )}

                    {issue.description && (
                      <Typography variant="body2" color="text.secondary" mb={2}>
                        {issue.description}
                      </Typography>
                    )}
                  </Box>
                </CardContent>

                <CardActions sx={{ p: 2, pt: 0 }}>
                  {issue.status !== 'RESOLVED' && issue.status !== 'CLOSED' && (
                    <Button
                      size="small"
                      startIcon={<CheckCircle />}
                      onClick={() => handleChangeStatus(issue.id, 'RESOLVED')}
                    >
                      {tc('markResolved')}
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {filteredIssues.length === 0 && (
          <Box textAlign="center" py={8}>
            <Build sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              {tc('noIssuesFound')}
            </Typography>
          </Box>
        )}
      </SectionCard>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEditIssue}>
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          <ListItemText>{tc('edit')}</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleAssignIssue}>
          <ListItemIcon>
            <PersonAdd fontSize="small" />
          </ListItemIcon>
          <ListItemText>{tc('assign')}</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDeleteIssue}>
          <ListItemIcon>
            <Delete fontSize="small" />
          </ListItemIcon>
          <ListItemText>{tc('delete')}</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() =>
            selectedIssue && handleChangeStatus(selectedIssue.id, 'CLOSED')
          }
          disabled={!selectedIssue}
        >
          <ListItemIcon>
            <Close fontSize="small" />
          </ListItemIcon>
          <ListItemText>{tc('close')}</ListItemText>
        </MenuItem>
      </Menu>

      <IssueModal
        open={issueModalOpen}
        issue={editingIssue}
        onClose={() => {
          setIssueModalOpen(false);
          setEditingIssue(null);
        }}
        onSave={() => {
          fetchIssues();
          setIssueModalOpen(false);
          setEditingIssue(null);
        }}
      />

      <AssignIssueModal
        open={assignModalOpen}
        issue={assigningIssue}
        onClose={() => {
          setAssingModalOpen(false);
          setAssigningIssue(null);
        }}
        onAssign={() => {
          fetchIssues();
          setAssingModalOpen(false);
          setAssigningIssue(null);
        }}
      />
    </Box>
  );
}

export default MaintenancePage;
