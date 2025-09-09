import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { axiosAuthApi } from '../../../middleware/axiosApi.ts';
import {
  Box,
  Typography,
  Button,
  TextField,
  Card,
  CardContent,
  useTheme,
} from '@mui/material';
import { ServiceProps } from '../available-services/AvailableServiceCard.tsx';
import { useTranslation } from 'react-i18next';
import Grid from '@mui/material/Grid';

function ServiceSchedulePage() {
  const params = useParams();
  const location = useLocation();
  const serviceFromState = location.state as ServiceProps | undefined;
  const [service, setService] = useState<ServiceProps | undefined>(serviceFromState);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const theme = useTheme();

  useEffect(()=>{
    if (serviceFromState) return;
    setLoading(true);
    axiosAuthApi.get(`/services/one/${params.id}`)
      .then(response => setService(response.data))
      .catch(error => console.log(error))
      .finally(() => setLoading(false));
  }, [params.id, serviceFromState])

  if(loading || service == null){
    return <p>Loading...</p>;
  }
  return (
    <main style={{ width: '100%' }}>
      <Grid component="div" container spacing={3}>
        <Grid component="div" item spacing={3} sx={{ flexGrow: 1 }}>
          <Card
            elevation={0}
            sx={{
              borderRadius: 2,
              border: `1px solid ${theme.palette.primary.border}`,
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', width: '100%', gap: 2 }}>
                <img
                  style={{
                    width: 70,
                    height: 70,
                    borderRadius: 10,
                    marginTop: 5,
                    objectFit: 'cover',
                  }}
                  src={service.image}
                  alt={service.name}
                />
                <div style={{display: 'flex', flexDirection:'column', justifyContent: 'space-around' }}>
                  <Typography
                    variant="h1"
                    sx={{ fontWeight: '600', fontSize: '1.5em' }}
                  >
                    {service.name}
                  </Typography>
                  <div
                    style={{
                      fontSize: '0.8em',
                      fontWeight: '600',
                      borderRadius: '4px',
                      backgroundColor: service.disabled
                        ? theme.palette.secondary.error
                        : theme.palette.primary.main,
                      color: 'white',
                      padding: '2px 4px',
                      width: 'fit-content',
                    }}
                  >
                    {service.disabled ? 'Unavailable' : 'Available'}
                  </div>
                </div>
              </Box>

              <Typography variant="body2" color="text.secondary" sx={{ margin: '10px 0px', fontSize: '1em' }}>
                {service.description}
              </Typography>

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  p: 2,
                  border: `1px solid ${theme.palette.primary.border}`,
                  borderRadius: 2,
                  mb: 2,
                  backgroundColor: theme.palette.background.default,
                }}
              >
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Price
                  </Typography>
                  <Typography sx={{ fontWeight: 'bold' }}>
                    {service.price}$
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Duration
                  </Typography>
                  <Typography sx={{ fontWeight: 'bold' }}>
                    {service.duration} min
                  </Typography>
                </Box>
              </Box>

              <Button
                fullWidth
                variant="contained"
                sx={{
                  borderRadius: 2,
                  py: 1.2,
                  fontWeight: '600',
                  textTransform: 'none',
                }}
              >
                {t('pages.service_schedule.addToCart') || 'Add to Cart'}
              </Button>

              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: 'block', textAlign: 'center', mt: 1 }}
              >
                1 item in basket
              </Typography>
            </CardContent>
          </Card>

          <Card
            Card
            elevation={0}
            sx={{
              borderRadius: 2,
              border: `1px solid ${theme.palette.primary.border}`,
            }}
          >
            <CardContent>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                What's included?
              </Typography>
              <ul style={{ margin: 0, paddingLeft: '20px' }}>
                <li>Fresh, high-quality ingredients</li>
                <li>Delivered directly to your room</li>
                <li>Complimentary setup and cleanup</li>
              </ul>
            </CardContent>
          </Card>
        </Grid>

        <Grid component="div" item xs={12} md={12} sx={{ flexGrow: 1 }}>
          <Card
            Card
            elevation={0}
            sx={{
              borderRadius: 2,
              border: `1px solid ${theme.palette.primary.border}`,
            }}
          >
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Book your service
              </Typography>

              {/* Select Date */}
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Select date
              </Typography>
              <Box
                sx={{
                  border: '1px solid #eee',
                  borderRadius: 2,
                  height: 200,
                  mb: 2,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  color: 'text.secondary',
                }}
              >
                July 2025
              </Box>

              {/* Select time */}
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Select time
              </Typography>
              <TextField
                select
                fullWidth
                size="small"
                placeholder="Choose a time slot"
                sx={{ mb: 2 }}
              />

              {/* Special requests */}
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Special requests
              </Typography>
              <TextField
                fullWidth
                multiline
                minRows={3}
                placeholder="Any special requirements or preferences..."
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </main>
  );
}

export default ServiceSchedulePage;
