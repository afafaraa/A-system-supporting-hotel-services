import { useState, useMemo } from 'react';
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
  InputAdornment,
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
  MoreVert,
  ChevronLeft,
  ChevronRight,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { RoomStatus } from '../../../types/room';

interface Room {
  id: number;
  roomNo: string;
  roomType: string;
  bedCapacity: number;
  rent: string;
  status: RoomStatus;
}

interface RoomType {
  name: string;
  rentBasic: string;
  noOfRooms: number;
  bedCapacity: number;
  status: 'Active' | 'Inactive';
}

function RoomsManagementPage() {
  const [selectedRooms, setSelectedRooms] = useState<number[]>([]);
  const [roomTypeStatusFilter, setRoomTypeStatusFilter] =
    useState('All Status');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const { t } = useTranslation();
  const tc = (key: string) => t(`pages.manager.personnel.${key}`);
  const [searchOpen, setSearchOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterRoomNumber, setFilterRoomNumber] = useState<number>(0);
  const [open, setOpen] = useState(false);

  const allRooms: Room[] = [
    {
      id: 1,
      roomNo: '101',
      roomType: 'Single',
      bedCapacity: 1,
      rent: '25$',
      status: 'booked',
    },
    {
      id: 2,
      roomNo: '102',
      roomType: 'Single',
      bedCapacity: 1,
      rent: '25$',
      status: 'booked',
    },
    {
      id: 3,
      roomNo: '103',
      roomType: 'Single',
      bedCapacity: 2,
      rent: '25$',
      status: 'open',
    },
    {
      id: 4,
      roomNo: '104',
      roomType: 'Double',
      bedCapacity: 3,
      rent: '25$',
      status: 'open',
    },
    {
      id: 5,
      roomNo: '201',
      roomType: 'Double',
      bedCapacity: 3,
      rent: '25$',
      status: 'pending',
    },
    {
      id: 6,
      roomNo: '202',
      roomType: 'Double',
      bedCapacity: 3,
      rent: '25$',
      status: 'open',
    },
    {
      id: 7,
      roomNo: '203',
      roomType: 'Single',
      bedCapacity: 1,
      rent: '25$',
      status: 'booked',
    },
    {
      id: 8,
      roomNo: '204',
      roomType: 'Delux',
      bedCapacity: 4,
      rent: '100$',
      status: 'open',
    },
  ];

  const totalPages = Math.ceil(allRooms.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const rooms = allRooms.slice(startIndex, endIndex);

  const roomTypes: RoomType[] = [
    {
      name: 'Single',
      rentBasic: '25$',
      noOfRooms: 30,
      bedCapacity: 1,
      status: 'Active',
    },
    {
      name: 'Doube',
      rentBasic: '50$',
      noOfRooms: 50,
      bedCapacity: 2,
      status: 'Active',
    },
    {
      name: 'Delux',
      rentBasic: '100$',
      noOfRooms: 5,
      bedCapacity: 3,
      status: 'Inactive',
    },
  ];

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRooms(rooms.map((r) => r.id));
    } else {
      setSelectedRooms([]);
    }
  };

  const handleSelectRoom = (id: number) => {
    setSelectedRooms((prev) =>
      prev.includes(id) ? prev.filter((rId) => rId !== id) : [...prev, id]
    );
  };

  const handleRemoveSelected = () => {
    if (selectedRooms.length > 0) {
      // Handle remove logic here
      console.log('Removing rooms:', selectedRooms);
      setSelectedRooms([]);
    }
  };

  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      const roomNumberMatch =
        !filterRoomNumber || room.roomNo.includes(String(filterRoomNumber));

      const statusMatch =
        filterStatus === 'all' ||
        room.status.toLowerCase() === filterStatus.toLowerCase();

      return roomNumberMatch && statusMatch;
    });
  }, [rooms, filterRoomNumber, filterStatus]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'booked':
        return 'primary';
      case 'open':
        return 'success';
      case 'pending':
        return 'warning';
      case 'active':
        return 'success';
      case 'outOfService':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Typography variant="h5" mb={3} mt={1}>
        Overview and edit hotel rooms
      </Typography>

      <Paper
        elevation={0}
        sx={{
          mb: 4,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          mx: 0,
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
              Room List
            </Typography>
            <Box
              display="flex"
              alignItems="center"
              flexWrap="wrap"
              gap={2}
              justifyContent="flex-end"
              flexGrow={1}
            >
              <ClickAwayListener onClickAway={() => setSearchOpen(false)}>
                <Box
                  display="grid"
                  alignItems="center"
                  position="relative"
                  gridTemplateColumns={`auto ${searchOpen ? '1fr' : '0fr'}`}
                  columnGap={searchOpen ? 1 : 0}
                  sx={{
                    transition:
                      'grid-template-columns 0.3s ease, column-gap 0.3s ease, flex-wrap 0.3s ease',
                  }}
                >
                  <IconButton onClick={() => setSearchOpen(!searchOpen)}>
                    <Search />
                  </IconButton>
                  <TextField
                    placeholder={tc('searchPlaceholder')}
                    variant="outlined"
                    size="small"
                    value={filterRoomNumber}
                    onChange={(e) =>
                      setFilterRoomNumber(Number(e.target.value))
                    }
                    sx={{
                      visibility: searchOpen ? 'visible' : 'hidden',
                    }}
                    autoFocus
                  />
                </Box>
              </ClickAwayListener>

              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel id="position-label">{tc('position')}</InputLabel>
                <Select
                  labelId="position-label"
                  label={tc('type')}
                  value={filterStatus}
                  onChange={(e) =>
                    setFilterStatus(e.target.value as 'ALL' | RoomStatus)
                  }
                >
                  <MenuItem value="all">{tc('all')}</MenuItem>
                  <MenuItem value="booked">Booked</MenuItem>
                  <MenuItem value="open">Open</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="outOfService">Out of Service</MenuItem>
                </Select>
              </FormControl>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setOpen(true)}
                sx={{ borderRadius: '12px' }}
              >
                Add
              </Button>
            </Box>
            {selectedRooms.length > 0 && (
              <Button
                variant="outlined"
                color="error"
                onClick={handleRemoveSelected}
                sx={{ textTransform: 'none' }}
              >
                Remove ({selectedRooms.length})
              </Button>
            )}
          </Box>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedRooms.length === rooms.length}
                    indeterminate={
                      selectedRooms.length > 0 &&
                      selectedRooms.length < rooms.length
                    }
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Room No.</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Room Type</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Bed Capacity</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Rent</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRooms.map((room) => (
                <TableRow key={room.id} hover>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedRooms.includes(room.id)}
                      onChange={() => handleSelectRoom(room.id)}
                    />
                  </TableCell>
                  <TableCell>{room.roomNo}</TableCell>
                  <TableCell>{room.roomType}</TableCell>
                  <TableCell>{room.bedCapacity}</TableCell>
                  <TableCell>{room.rent}</TableCell>
                  <TableCell>
                    <Chip
                      label={room.status}
                      color={getStatusColor(room.status)}
                      size="small"
                      sx={{ fontWeight: 500 }}
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton size="small">
                      <MoreVert />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box
          sx={{
            p: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box display="flex" gap={1}>
            <IconButton
              size="small"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
            >
              <ChevronLeft />
            </IconButton>
            <IconButton
              size="small"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              <ChevronRight />
            </IconButton>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Page {currentPage} of {totalPages}
          </Typography>
        </Box>
      </Paper>

      {/* Room Type Section */}
      <Paper
        elevation={0}
        sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}
      >
        <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h6" fontWeight="600">
              Room Type
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              sx={{ textTransform: 'none' }}
            >
              Add
            </Button>
          </Box>

          <Box display="flex" gap={2}>
            <TextField
              placeholder="Search..."
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search fontSize="small" />
                  </InputAdornment>
                ),
              }}
              sx={{ flexGrow: 1, maxWidth: 300 }}
            />
            <Select
              value={roomTypeStatusFilter}
              onChange={(e) => setRoomTypeStatusFilter(e.target.value)}
              size="small"
              sx={{ minWidth: 150 }}
            >
              <MenuItem value="All Status">All Status</MenuItem>
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
            </Select>
          </Box>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox />
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Rent(Basic)</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>No Of Room</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>
                  Bed Capacity(Basic)
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {roomTypes.map((roomType, index) => (
                <TableRow key={index} hover>
                  <TableCell padding="checkbox">
                    <Checkbox />
                  </TableCell>
                  <TableCell>{roomType.name}</TableCell>
                  <TableCell>{roomType.rentBasic}</TableCell>
                  <TableCell>{roomType.noOfRooms}</TableCell>
                  <TableCell>{roomType.bedCapacity}</TableCell>
                  <TableCell>
                    <Chip
                      label={roomType.status}
                      color={getStatusColor(roomType.status)}
                      size="small"
                      sx={{ fontWeight: 500 }}
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton size="small">
                      <MoreVert />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}

export default RoomsManagementPage;
