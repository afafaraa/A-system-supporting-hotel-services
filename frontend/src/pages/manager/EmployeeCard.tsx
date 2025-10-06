import { useState } from 'react';
import {
  Avatar,
  Box,
  IconButton,
  Chip,
  Typography,
  Popover,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import { Edit, MoreVert, TrendingUp, Delete } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Employee } from '../../types';
import EditEmployeeModal from './modals/EditEmployeeModal.tsx';
import RemoveEmployeeModal from './modals/RemoveEmployeeModal.tsx';
import PromoteEmployeeModal from './modals/PromoteEmployeeModal.tsx';
import { useTranslation } from 'react-i18next';
import { EmployeeCardPaper } from '../../theme/styled-components/EmployeeCardPaper.ts';

interface EmployeeCardProps {
  employee: Employee;
  onUpdated: (employee: Employee) => void;
  onRemoved?: (employeeId: string) => void;
}

function EmployeeCard({ employee, onUpdated, onRemoved }: EmployeeCardProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [editOpen, setEditOpen] = useState(false);
  const [promoteOpen, setPromoteOpen] = useState(false);
  const [removeOpen, setRemoveOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    handleMenuClose();
    setEditOpen(true);
  };

  const handlePromote = () => {
    handleMenuClose();
    setPromoteOpen(true);
  };

  const handleRemove = () => {
    handleMenuClose();
    setRemoveOpen(true);
  };

  const menuOpen = Boolean(anchorEl);

  return (
    <EmployeeCardPaper>
      <Box
        display="flex"
        justifyContent="space-between"
        width="100%"
        onClick={() => navigate(`/employees/${employee.username}`)}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <Avatar
            sx={{
              bgcolor: "primary.light",
              width: 64,
              height: 64,
              color: 'primary.main',
              fontSize: 20,
              fontWeight: 'bold',
            }}
          >
            {employee.name[0]}
            {employee.surname[0]}
          </Avatar>

          <Box>
            <Typography fontWeight="bold">
              {employee.name} {employee.surname}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t(
                `common.department.${(employee.employeeData?.department ?? '').toLowerCase()}`
              )}
            </Typography>
          </Box>
        </Box>
        <Box>
          <IconButton
            color="primary"
            onClick={handleMenuOpen}
            sx={{
              border: 1,
              borderColor: 'primary.main',
              borderRadius: 1,
              width: 40,
              height: 40,
              p: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <MoreVert />
          </IconButton>
        </Box>
      </Box>

      <Box
        display="flex"
        flexWrap="wrap"
        gap={1}
        justifyContent="center"
        mt={1}
      >
        {employee.employeeData?.sectors?.map((area: string, idx: number) => (
          <Chip
            key={idx}
            label={t(`common.sectors.${area.toLowerCase()}`)}
            size="small"
            color="primary"
            variant="outlined"
          />
        ))}
      </Box>

      <Popover
        open={menuOpen}
        anchorEl={anchorEl}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        slotProps={{
          paper: {
            sx: {
              mt: 1,
              boxShadow: 3,
              borderRadius: 2,
              minWidth: 180,
            },
          },
        }}
      >
        <List sx={{ py: 1 }}>
          <ListItemButton onClick={handleEdit}>
            <ListItemIcon sx={{ minWidth: 40 }}>
              <Edit fontSize="small" color="primary" />
            </ListItemIcon>
            <ListItemText primary={t('buttons.edit')} />
          </ListItemButton>

          <ListItemButton onClick={handlePromote}>
            <ListItemIcon sx={{ minWidth: 40 }}>
              <TrendingUp fontSize="small" color="success" />
            </ListItemIcon>
            <ListItemText primary={t('buttons.promote')} />
          </ListItemButton>

          <Divider />

          <ListItemButton onClick={handleRemove}>
            <ListItemIcon sx={{ minWidth: 40 }}>
              <Delete fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText
              primary={t('buttons.remove')}
              sx={{ color: 'error.main' }}
            />
          </ListItemButton>
        </List>
      </Popover>

      <EditEmployeeModal
        open={editOpen}
        initial={employee}
        onClose={() => setEditOpen(false)}
        onSaved={(updatedEmployee) => {
          if (updatedEmployee) {
            onUpdated(updatedEmployee);
          }
          setEditOpen(false);
        }}
      />

      <PromoteEmployeeModal
        open={promoteOpen}
        employee={employee}
        onClose={() => setPromoteOpen(false)}
        onPromoted={(updatedEmployee) => {
          if (updatedEmployee) {
            onUpdated(updatedEmployee);
          }
          setPromoteOpen(false);
        }}
      />

      <RemoveEmployeeModal
        open={removeOpen}
        employee={employee}
        onClose={() => setRemoveOpen(false)}
        onRemoved={() => {
          if (onRemoved) {
            onRemoved(employee.id);
          }
          setRemoveOpen(false);
        }}
      />
    </EmployeeCardPaper>
  );
}

export default EmployeeCard;
