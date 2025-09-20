import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Stack,
  Button,
  useTheme,
} from '@mui/material';
import { Room } from '../../../types/room.ts';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { mapAmenityToIcon } from '../../../utils/mapAmenityToIcon.tsx';

export default function RoomCard({
  room,
  onReserve,
  size = 'medium',
}: {
  room: Room;
  onReserve: () => void;
  size: 'small' | 'medium' | 'large' | undefined;
}) {
  const theme = useTheme();
  const { t } = useTranslation();

  const fontSize = useMemo(() => {
    switch (size) {
      case 'medium':
        return 16;
      case 'small':
        return 14;
      case 'large':
        return 18;
    }
  }, [size]);

  return (
    <Card
      sx={{
        borderRadius: '10px',
        height: '100%',
        border: `1px solid ${theme.palette.primary.border}`,
      }}
      elevation={0}
    >
      <CardContent
        sx={{
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '100%',
        }}
      >
        <div>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, fontSize: `${fontSize + 4}px` }}
            >
              {t(`pages.home.${room.type}Title`)}
            </Typography>
            <Chip
              label={`${room.price}/night`}
              sx={{
                backgroundColor: theme.palette.secondary.main,
                fontWeight: 'bold',
                borderRadius: '10px',
                fontSize: `${fontSize - 2}px`,
              }}
            />
          </Box>

          <Typography
            sx={{
              marginTop: '10px',
              color: theme.palette.text.secondary,
              fontSize: `${fontSize}px`,
            }}
          >
            {t(`pages.home.${room.type}Desc`)}
          </Typography>

          <Typography
            sx={{
              marginTop: '8px',
              fontSize: `${fontSize}px`,
              color: theme.palette.text.secondary,
            }}
          >
            Up to {room.guestsTotal} guests
          </Typography>
        </div>

        <div>
          <Typography
            variant="subtitle2"
            sx={{
              marginTop: '15px',
              fontWeight: '600',
              fontSize: `${fontSize}`,
            }}
          >
            Amenities
          </Typography>

          <Stack
            direction="row"
            justifyContent="center"
            flexWrap="wrap"
            sx={{ marginTop: '10px' }}
          >
            {room.amenities.map((amenity, idx) => (
              <Chip
                key={idx}
                icon={mapAmenityToIcon(amenity.key, `${fontSize}px`)}
                label={amenity.label}
                sx={{
                  backgroundColor: theme.palette.background.paper,
                  fontSize: `${fontSize - 2}px`,
                  border: `1px solid ${theme.palette.primary.border}`,
                  padding: 0,
                  height: 'auto',
                  borderRadius: '5px',
                  margin: '2px',
                }}
              />
            ))}
          </Stack>
          <Button
            variant="contained"
            color="primary"
            sx={{ marginTop: '20px', width: '100%' }}
            onClick={onReserve}
          >
            Reserve Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
