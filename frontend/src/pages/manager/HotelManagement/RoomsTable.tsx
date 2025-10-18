import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  IconButton,
  TextField,
  Select,
  MenuItem,
  Chip,
  Paper,
  ClickAwayListener,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Add,
  Search,
  ChevronLeft,
  ChevronRight,
  Edit,
  Delete,
} from '@mui/icons-material';
import { Room, RoomStatus } from '../../../types/room.ts';
import { useTranslation } from 'react-i18next';

interface RoomsTableProps {
  rooms: Room[];
  selectedRooms: string[];
  onSelectRoom: (number: string) => void;
  onAddRoom: () => void;
  onEditRoom: (room: Room) => void;
  onDeleteRoom: (number: string) => void;
  onRemoveSelected: () => void;
}

function RoomsTable({
  rooms,
  selectedRooms,
  onSelectRoom,
  onAddRoom,
  onEditRoom,
  onDeleteRoom,
  onRemoveSelected,
}: RoomsTableProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'ALL' | RoomStatus>('ALL');
  const [filterRoomNumber, setFilterRoomNumber] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const { t } = useTranslation();
  const tc = (key: string) => t(`pages.manager.hotel_management.${key}`);

  const filteredRooms = rooms.filter((room) => {
    const roomNumberMatch =
      !filterRoomNumber || room.number.includes(filterRoomNumber);
    const statusMatch =
      filterStatus === 'ALL' || room.roomStatus === filterStatus;
    return roomNumberMatch && statusMatch;
  });

  const totalPages = Math.ceil(filteredRooms.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'BOOKED':
        return 'primary';
      case 'OPEN':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'OUT_OF_SERVICE':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        mb: 4,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
      }}
    >
      <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h6" fontWeight="600">
            {tc('rooms_list')}
          </Typography>
          <Box display="flex" alignItems="center" gap={2}>
            <ClickAwayListener onClickAway={() => setSearchOpen(false)}>
              <Box
                display="grid"
                alignItems="center"
                gridTemplateColumns={`auto ${searchOpen ? '1fr' : '0fr'}`}
                columnGap={searchOpen ? 1 : 0}
                maxWidth={searchOpen ? 200 : 30}
                sx={{ transition: 'all 0.3s ease' }}
              >
                <IconButton onClick={() => setSearchOpen(!searchOpen)}>
                  <Search />
                </IconButton>
                <TextField
                  placeholder={tc('search_placeholder')}
                  variant="outlined"
                  size="small"
                  value={filterRoomNumber}
                  onChange={(e) => setFilterRoomNumber(e.target.value)}
                  sx={{ visibility: searchOpen ? 'visible' : 'hidden' }}
                  autoFocus
                />
              </Box>
            </ClickAwayListener>

            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Status</InputLabel>
              <Select
                label="Status"
                value={filterStatus}
                onChange={(e) =>
                  setFilterStatus(e.target.value as 'ALL' | RoomStatus)
                }
              >
                <MenuItem value="ALL">{t('common.all')}</MenuItem>
                <MenuItem value="BOOKED">
                  {t('common.room_status.booked')}
                </MenuItem>
                <MenuItem value="OPEN">{t('common.room_status.open')}</MenuItem>
                <MenuItem value="PENDING">
                  {t('common.room_status.pending')}
                </MenuItem>
                <MenuItem value="OUT_OF_SERVICE">
                  {t('common.room_status.out_of_service')}
                </MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={onAddRoom}
              sx={{ borderRadius: '12px' }}
            >
              {t('buttons.add')}
            </Button>

            {selectedRooms.length > 0 && (
              <Button
                variant="contained"
                color="error"
                onClick={onRemoveSelected}
                sx={{ borderRadius: '12px' }}
              >
                {t('buttons.remove')} ({selectedRooms.length})
              </Button>
            )}
          </Box>
        </Box>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox"></TableCell>
              <TableCell align="center" sx={{ fontWeight: 600 }}>
                {tc('room_no')}
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 600 }}>
                {tc('room_type')}
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 600 }}>
                {tc('capacity')}
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 600 }}>
                {tc('price')}
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 600 }}>
                {tc('floor')}
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 600 }}>
                {t('common.status')}
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 600 }}>
                {t('common.actions')}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRooms.slice(startIndex, endIndex).map((room) => (
              <TableRow key={room.number} hover>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedRooms.includes(room.number)}
                    onChange={() => onSelectRoom(room.number)}
                  />
                </TableCell>
                <TableCell align="center">{room.number}</TableCell>
                <TableCell align="center">
                  {t(`common.room_standard.${room.standard?.name}`) || 'N/A'}
                </TableCell>
                <TableCell align="center">
                  {room.standard?.capacity || 'N/A'}
                </TableCell>
                <TableCell align="center">
                  {room.standard?.basePrice.toFixed(2) || 'N/A'} $
                </TableCell>
                <TableCell align="center">{room.floor || '-'}</TableCell>
                <TableCell align="center">
                  <Chip
                    label={room.roomStatus.replace(/_/g, ' ')}
                    color={getStatusColor(room.roomStatus)}
                    size="small"
                    sx={{ fontWeight: 500 }}
                  />
                </TableCell>
                <TableCell align="center">
                  <IconButton size="small" onClick={() => onEditRoom(room)}>
                    <Edit />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => onDeleteRoom(room.number)}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Box display="flex" gap={1}>
          <IconButton
            size="small"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight />
          </IconButton>
        </Box>
        <Typography variant="body2" color="text.secondary">
          {t('common.page')} {currentPage} / {totalPages || 1}
        </Typography>
      </Box>
    </Paper>
  );
}

export default RoomsTable;
