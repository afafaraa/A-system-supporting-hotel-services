import { useState, useCallback, useEffect } from 'react';
import { Box, CircularProgress, Alert, Snackbar } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { axiosAuthApi } from '../../../middleware/axiosApi.ts';
import { Room, RoomStandard } from '../../../types/room.ts';
import RoomsTable from './RoomsTable.tsx';
import RoomStandardsTable from './RoomsStandardsTable.tsx';
import RoomModal from './RoomModal.tsx';
import RoomStandardModal from './RoomStandardModal.tsx';
import SectionTitle from '../../../components/ui/SectionTitle.tsx';

function RoomsManagementPage() {
  const { t } = useTranslation();
  const tc = (key: string) => t(`pages.manager.hotel_management.${key}`);

  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [allRooms, setAllRooms] = useState<Room[]>([]);
  const [roomDialogOpen, setRoomDialogOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);

  const [allStandards, setAllStandards] = useState<RoomStandard[]>([]);
  const [standardDialogOpen, setStandardDialogOpen] = useState(false);
  const [editingStandard, setEditingStandard] = useState<RoomStandard | null>(
    null
  );

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({ open: false, message: '', severity: 'success' });

  const fetchRooms = useCallback(async () => {
    setLoading(true);

    try {
      const res = await axiosAuthApi.get<Room[]>('/rooms');
      setAllRooms(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStandards = useCallback(async () => {
    try {
      const res = await axiosAuthApi.get<RoomStandard[]>(
        '/rooms/room-standards'
      );
      setAllStandards(res.data);
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: 'Failed to fetch room standards',
        severity: 'error',
      });
    }
  }, []);

  useEffect(() => {
    fetchRooms();
    fetchStandards();
  }, [fetchRooms, fetchStandards]);

  const handleSelectRoom = (number: string) => {
    setSelectedRooms((prev) =>
      prev.includes(number)
        ? prev.filter((n) => n !== number)
        : [...prev, number]
    );
  };

  const handleRemoveSelectedRooms = async () => {
    if (selectedRooms.length === 0) return;

    try {
      await Promise.all(
        selectedRooms.map((number) => axiosAuthApi.delete(`/rooms/${number}`))
      );
      setSnackbar({
        open: true,
        message: `${selectedRooms.length} room(s) deleted successfully`,
        severity: 'success',
      });
      setSelectedRooms([]);
      fetchRooms();
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Failed to delete rooms',
        severity: 'error',
      });
    }
  };

  const handleDeleteRoom = async (number: string) => {
    if (!window.confirm('Are you sure you want to delete this room?')) return;

    try {
      await axiosAuthApi.delete(`/rooms/${number}`);
      setSnackbar({
        open: true,
        message: 'Room deleted successfully',
        severity: 'success',
      });
      fetchRooms();
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Failed to delete room',
        severity: 'error',
      });
    }
  };

  const handleSaveStandard = async (standard: RoomStandard) => {
    try {
      if (editingStandard?.id) {
        await axiosAuthApi.put(
          `/rooms/room-standard/${editingStandard.id}`,
          standard
        );
        setSnackbar({
          open: true,
          message: 'Room standard updated successfully',
          severity: 'success',
        });
      } else {
        await axiosAuthApi.post('/rooms/room-standard', standard);
        setSnackbar({
          open: true,
          message: 'Room standard created successfully',
          severity: 'success',
        });
      }
      setStandardDialogOpen(false);
      setEditingStandard(null);
      fetchStandards();
      fetchRooms();
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err.response?.data || 'Failed to save room standard',
        severity: 'error',
      });
    }
  };

  const handleDeleteStandard = async (id: string) => {
    try {
      await axiosAuthApi.delete(`/rooms/room-standard/${id}`);
      setSnackbar({
        open: true,
        message: 'Room standard deleted successfully',
        severity: 'success',
      });
      fetchStandards();
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err.response?.data || 'Failed to delete room standard',
        severity: 'error',
      });
    }
  };

  if (loading && allRooms.length === 0) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  function handleSaveRoom(): void {
    throw new Error('Function not implemented.');
  }

  return (
    <Box>
      <SectionTitle
        title={tc('rooms_title')}
        subtitle={tc('rooms_subtitle')}
        mb={2}
      ></SectionTitle>

      <RoomsTable
        rooms={allRooms}
        selectedRooms={selectedRooms}
        onSelectRoom={handleSelectRoom}
        onAddRoom={() => {
          setEditingRoom(null);
          setRoomDialogOpen(true);
        }}
        onEditRoom={(room) => {
          setEditingRoom(room);
          setRoomDialogOpen(true);
        }}
        onDeleteRoom={handleDeleteRoom}
        onRemoveSelected={handleRemoveSelectedRooms}
      />

      <RoomStandardsTable
        standards={allStandards}
        onAddStandard={() => {
          setEditingStandard(null);
          setStandardDialogOpen(true);
        }}
        onEditStandard={(standard) => {
          setEditingStandard(standard);
          setStandardDialogOpen(true);
        }}
        onDeleteStandard={handleDeleteStandard}
      />

      <RoomModal
        open={roomDialogOpen}
        room={editingRoom}
        standards={allStandards}
        onClose={() => {
          setRoomDialogOpen(false);
          setEditingRoom(null);
        }}
        onSave={handleSaveRoom}
      />

      <RoomStandardModal
        open={standardDialogOpen}
        standard={editingStandard}
        onClose={() => {
          setStandardDialogOpen(false);
          setEditingStandard(null);
        }}
        onSave={handleSaveStandard}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default RoomsManagementPage;
