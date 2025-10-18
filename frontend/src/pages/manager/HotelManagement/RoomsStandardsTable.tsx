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
  IconButton,
  Paper,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { RoomStandard as RoomStandardEntity } from '../../../types/room.ts';
import { useTranslation } from 'react-i18next';

interface RoomStandardsTableProps {
  standards: RoomStandardEntity[];
  onAddStandard: () => void;
  onEditStandard: (standard: RoomStandardEntity) => void;
  onDeleteStandard: (id: string) => void;
}

function RoomStandardsTable({
  standards,
  onAddStandard,
  onEditStandard,
  onDeleteStandard,
}: RoomStandardsTableProps) {
  const { t } = useTranslation();
  const tc = (key: string) => t(`pages.manager.hotel_management.${key}`);
  return (
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
            {tc('standards_list')}
          </Typography>
          <Box display="flex" gap={2}>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={onAddStandard}
              sx={{ borderRadius: '12px' }}
            >
              {t('buttons.add')}
            </Button>
          </Box>
        </Box>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, textAlign: 'center' }}>
                {tc('name')}
              </TableCell>
              <TableCell sx={{ fontWeight: 600, textAlign: 'center' }}>
                {tc('base_price')}
              </TableCell>
              <TableCell sx={{ fontWeight: 600, textAlign: 'center' }}>
                {tc('capacity')}
              </TableCell>
              <TableCell sx={{ fontWeight: 600, textAlign: 'right' }}>
                {t('common.actions')}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {standards.map((standard) => (
              <TableRow key={standard.id} hover>
                <TableCell sx={{ textAlign: 'center' }}>
                  {t(`common.room_standard.${standard.name}`)}
                </TableCell>
                <TableCell sx={{ textAlign: 'center' }}>
                  {standard.basePrice.toFixed(2)} $
                </TableCell>
                <TableCell sx={{ textAlign: 'center' }}>
                  {standard.capacity}
                </TableCell>
                <TableCell sx={{ textAlign: 'right' }}>
                  <IconButton
                    size="small"
                    onClick={() => onEditStandard(standard)}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => onDeleteStandard(standard.id!)}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

export default RoomStandardsTable;
