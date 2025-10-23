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
import {useMemo} from 'react';
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
      }}
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
              {room.standard.name
                .replace(/_/g, ' ')
                .toLowerCase()
                .replace(/^\w/, c => c.toUpperCase())}
            </Typography>
            <Chip
              label={`${room.pricePerNight}$/night`}
              color="secondary"
              sx={{
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
            {room.description}
          </Typography>
          <Typography
            sx={{
              marginTop: '8px',
              fontSize: `${fontSize}px`,
              color: theme.palette.text.secondary,
            }}
          >
            Up to {room.capacity} guests
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
            {room.amenities &&
              Array.isArray(room.amenities) &&
              room.amenities.map((amenity, idx) => {
                if (!amenity || !amenity.key) return null;
                const base = amenity.label || amenity.key;
                const formattedAmenity = base
                  .replace(/_/g, ' ')
                  .toLowerCase()
                  .replace(/^\w/, c => c.toUpperCase());
                return (
                  <Chip
                    key={idx}
                    icon={mapAmenityToIcon(amenity.key, `${fontSize}px`)}
                    label={formattedAmenity}
                    sx={{
                      backgroundColor: theme.palette.background.paper,
                      fontSize: `${fontSize - 2}px`,
                      border: `1px solid ${theme.palette.divider}`,
                      padding: 0,
                      height: 'auto',
                      borderRadius: '5px',
                      margin: '2px',
                    }}
                  />
                );
              })}
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
