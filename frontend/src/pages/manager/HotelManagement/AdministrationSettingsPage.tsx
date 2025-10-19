import { useCallback, useEffect, useState } from 'react';
import {
  Box,
  CircularProgress,
  Divider,
  FormControl,
  TextField,
  Typography,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Button,
  Snackbar,
  Alert,
} from '@mui/material';
import { SectionCard } from '../../../theme/styled-components/SectionCard';
import { Settings, Save } from '@mui/icons-material';
import {
  AdministrationSettings,
  LanguageOption,
  TimezoneOption,
} from '../../../types/settings';
import { useTranslation } from 'react-i18next';
import { axiosAuthApi } from '../../../middleware/axiosApi';
import SectionTitle from '../../../components/ui/SectionTitle.tsx';

function AdministrationSettingsPage() {
  const { t } = useTranslation();
  const tc = (key: string) => t(`pages.manager.settings.${key}`);

  const [settings, setSettings] = useState<AdministrationSettings>({
    hotelName: '',
    address: '',
    phoneNumber: '',
    email: '',
    timezone: 'Europe/Warsaw',
    defaultLanguage: 'EN',
  });

  const [originalSettings, setOriginalSettings] =
    useState<AdministrationSettings | null>(null);
  const [timezones, setTimezones] = useState<TimezoneOption[]>([]);
  const [languages, setLanguages] = useState<LanguageOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({ open: false, message: '', severity: 'success' });

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axiosAuthApi.get<AdministrationSettings>('/settings');
      setSettings(res.data);
      setOriginalSettings(res.data);
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: 'Failed to load settings',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTimezones = useCallback(async () => {
    try {
      const res = await axiosAuthApi.get<TimezoneOption[]>(
        '/settings/available-timezones'
      );
      setTimezones(res.data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const fetchLanguages = useCallback(async () => {
    try {
      const res = await axiosAuthApi.get<LanguageOption[]>(
        '/settings/available-languages'
      );
      setLanguages(res.data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
    fetchLanguages();
    fetchTimezones();
  }, [fetchSettings, fetchTimezones, fetchLanguages]);

  const handleChange = (field: keyof AdministrationSettings, value: string) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await axiosAuthApi.put('/settings', settings);
      setOriginalSettings(settings);
      setSnackbar({
        open: true,
        message: 'Settings saved successfully',
        severity: 'success',
      });
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err.response?.data,
        severity: 'success',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDiscard = () => {
    if (originalSettings) {
      setSettings(originalSettings);
    }
  };

  const hasChanges =
    JSON.stringify(settings) !== JSON.stringify(originalSettings);

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
            <Settings /> {tc('title')}
          </>
        }
        subtitle={tc('subtitle')}
        mb={3}
      />
      <SectionCard>
        <Box mb={4}>
          <Typography variant="h6" gutterBottom fontWeight={600}>
            {tc('hotelInfo')}
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            {tc('hotelInfoDesc')}
          </Typography>

          <Box display="flex" flexDirection="column" gap={3}>
            <TextField
              label={tc('hotelName')}
              value={settings.hotelName}
              onChange={(e) => handleChange('hotelName', e.target.value)}
              fullWidth
              required
            />

            <TextField
              label={tc('address')}
              value={settings.address}
              onChange={(e) => handleChange('address', e.target.value)}
              fullWidth
              required
              multiline
              rows={2}
            />

            <Box display="flex" gap={2} flexWrap="wrap">
              <TextField
                label={tc('phoneNumber')}
                value={settings.phoneNumber}
                onChange={(e) => handleChange('phoneNumber', e.target.value)}
                required
                sx={{ flex: 1, minWidth: '200px' }}
              />

              <TextField
                label={tc('email')}
                value={settings.email}
                onChange={(e) => handleChange('email', e.target.value)}
                fullWidth
                type="email"
                required
                sx={{ flex: 1, minWidth: '200px' }}
              />
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Box>
          <Typography variant="h6" gutterBottom fontWeight={600}>
            {tc('regionalSettings')}
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            {tc('regionalSettingsDesc')}
          </Typography>

          <Box display="flex" gap={2} flexWrap="wrap">
            <FormControl sx={{ flex: 1, minWidth: '200px' }}>
              <InputLabel>{tc('timezone')}</InputLabel>
              <Select
                value={settings.timezone}
                label={tc('timezone')}
                onChange={(e) => handleChange('timezone', e.target.value)}
              >
                {timezones.map((tz) => (
                  <MenuItem key={tz.zoneId} value={tz.zoneId}>
                    {tz.displayName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ flex: 1, minWidth: '200px' }}>
              <InputLabel>{tc('defaultLanguage')}</InputLabel>
              <Select
                value={settings.defaultLanguage}
                label={tc('defaultLanguage')}
                onChange={(e) =>
                  handleChange('defaultLanguage', e.target.value)
                }
              >
                {languages.map((lang) => (
                  <MenuItem key={lang.code} value={lang.code}>
                    {lang.displayName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>

        {hasChanges && (
          <Paper
            sx={{
              position: 'sticky',
              bottom: 16,
              mt: 4,
              p: 2,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: 'backgorund.secondary',
              borderRadius: '12px',
              border: '1px solid',
              borderColor: 'divider',
              zIndex: 2,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              {tc('unsavedChanges')}
            </Typography>
            <Box display="flex" gap={2}>
              <Button
                variant="outlined"
                onClick={handleDiscard}
                disabled={saving}
                color="error"
              >
                {tc('discard')}
              </Button>
              <Button
                variant="contained"
                startIcon={saving ? <CircularProgress size={20} /> : <Save />}
                onClick={handleSave}
                disabled={saving}
                sx={{ borderRadius: '12px' }}
              >
                {tc('saveChanges')}
              </Button>
            </Box>
          </Paper>
        )}
      </SectionCard>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
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

export default AdministrationSettingsPage;
