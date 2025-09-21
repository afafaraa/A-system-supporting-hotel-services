import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Box,
  Typography,
  Paper,
  CircularProgress,
  Grid,
} from '@mui/material';
import { useState, useEffect, useRef } from 'react';
import { Service } from '../../../types';
import { axiosAuthApi } from '../../../middleware/axiosApi';
import { useTranslation } from 'react-i18next';
import {
  EditOutlined,
  Save,
  MeetingRoom,
  RoomService,
  CloudUpload,
  Error,
  CheckCircle,
} from '@mui/icons-material';

type Props = {
  open: boolean;
  initial?: Service;
  onClose: () => void;
  onSaved: (service: Service) => void;
};

type UploadState = 'idle' | 'uploading' | 'success' | 'error';

function ServiceFormModal({ open, initial, onClose, onSaved }: Props) {
  const { t } = useTranslation();
  const tc = (key: string) => t(`pages.manager.services_list.${key}`);
  const isEdit = Boolean(initial?.id);
  const [form, setForm] = useState<Service>({
    name: '',
    description: '',
    price: 0,
    type: 'GENERAL_SERVICE',
    disabled: false,
    duration: 60,
    maxAvailable: 1,
    weekday: [],
    image: '',
  });

  const [uploadState, setUploadState] = useState<UploadState>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  useEffect(() => {
    if (open) {
      if (initial) {
        setForm(initial);
      } else {
        setForm({
          name: '',
          description: '',
          price: 0,
          type: 'GENERAL_SERVICE',
          disabled: false,
          duration: 60,
          maxAvailable: 1,
          weekday: [],
          image: '',
        });
      }
      setUploadState('idle');
    }
  }, [open, initial]);

  const handleChange = (k: keyof Service, v: unknown) => {
    setForm((prev) => ({ ...prev, [k]: v }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = isEdit ? `/services/${initial?.id}` : '/services';
      const method = isEdit ? 'patch' : 'post';
      const payload = {
        ...form,
        rating: isEdit ? (form.rating ?? []) : [],
      };

      const res = await axiosAuthApi[method]<Service>(url, payload);
      onSaved(res.data);
      onClose();
    } catch (e) {
      console.error(e);
    }
  };

  const validateFile = (file: File): string | null => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 10 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      return tc("allowed_files_warning");
    }

    if (file.size > maxSize) {
      return tc("file_size_warning");
    }

    return null;
  };

  const uploadImage = async (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setUploadState('error');
      return;
    }

    setUploadState('uploading');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axiosAuthApi.post<{ downloadUri: string }>(
        '/uploads/image',
        formData
      );

      const imageUrl = response.data.downloadUri;
      console.log('Upload response:', response.data);
      console.log('Image URL:', imageUrl);
      handleChange('image', imageUrl);
      setUploadState('success');

      setTimeout(() => {
        if (uploadState !== 'error') {
          setUploadState('idle');
        }
      }, 2000);
    } catch (error: unknown) {
      let errorMessage = tc("upload_error")
      if (typeof error === 'object' && error !== null && 'response' in error) {
        const err = error as { response?: { data?: { error?: string } } };
        errorMessage = err.response?.data?.error || errorMessage;
      }
      setUploadState('error');
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadImage(file);
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);

    const files = Array.from(event.dataTransfer.files);
    const imageFile = files.find((file) => file.type.startsWith('image/'));

    if (imageFile) {
      uploadImage(imageFile);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          p: 2,
          maxHeight: '90vh',
          position: 'relative',
          borderRadius: 3,
        },
      }}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center">
          <EditOutlined sx={{ mr: 1, verticalAlign: 'middle' }} />
          <Typography variant="h5" fontWeight="bold">
            {isEdit ? tc("edit_service") : tc("add_service")}
          </Typography>
        </Box>
        <Typography variant="subtitle2" color="text.secondary">
          {isEdit ? tc("edit_subtitle") : tc("add_subtitle") }
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="body1" fontWeight="bold">
              {tc("name")}
            </Typography>
            <TextField
              variant="filled"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              fullWidth
              sx={{
                fontSize: '1.1rem',
                py: 0,
                '& .MuiInputBase-input': {
                  p: 1,
                },
              }}
              slotProps={{ input: { disableUnderline: true } as any }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="body1" fontWeight="bold">
              {tc("category")}
            </Typography>
            <TextField
              variant="filled"
              value={form.type}
              onChange={(e) => handleChange('type', e.target.value)}
              fullWidth
              sx={{
                fontSize: '1.1rem',
                py: 0,
                '& .MuiInputBase-input': {
                  p: 1,
                },
              }}
              slotProps={{ input: { disableUnderline: true } as any }}
            />
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="body1" fontWeight="bold">
              {tc("price")} ($)
            </Typography>
            <TextField
              variant="filled"
              value={form.price}
              onChange={(e) =>
                handleChange('price', parseFloat(e.target.value) || 0)
              }
              fullWidth
              sx={{
                fontSize: '1.1rem',
                py: 0,
                '& .MuiInputBase-input': {
                  p: 1,
                },
              }}
              slotProps={{ input: { disableUnderline: true } as any }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="body1" fontWeight="bold">
              {tc("duration")}
            </Typography>
            <TextField
              variant="filled"
              type="number"
              value={form.duration}
              onChange={(e) =>
                handleChange('duration', parseInt(e.target.value) || 0)
              }
              fullWidth
              sx={{
                fontSize: '1.1rem',
                py: 0,
                '& .MuiInputBase-input': {
                  p: 1,
                },
              }}
              slotProps={{ input: { disableUnderline: true } as any }}
            />
          </Grid>
        </Grid>

        <Box>
          <Typography variant="body1" fontWeight="bold">
            {tc("description")}
          </Typography>
          <TextField
            variant="filled"
            value={form.description}
            onChange={(e) => handleChange('description', e.target.value)}
            fullWidth
            multiline
            rows={3}
            sx={{
              fontSize: '1.1rem',
              py: 0,
              '& .MuiInputBase-root': {
                p: 1,
              },
            }}
            slotProps={{
              input: { disableUnderline: true } as any,
            }}
          />
        </Box>
        <Box>
          <Typography variant="body1" fontWeight="bold">
            {tc("icon")}
          </Typography>
          <Box display="flex" alignItems="center" gap={2} mb={1}>
            <Paper
              sx={{
                p: 1,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'primary.light',
                width: 60,
                height: 60,
                overflow: 'hidden',
                boxShadow: 0,
              }}
            >
              {form.type == 'GENERAL_SERVICE' ? (
                <MeetingRoom color="primary" fontSize="large" />
              ) : (
                <RoomService color="primary" fontSize="large" />
              )}
            </Paper>

            <Box
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              sx={{
                height: 80,
                width: '100%',
                border: 2,
                borderStyle: 'dashed',
                borderColor: isDragOver ? 'primary.main' : 'grey.300',
                borderRadius: 2,
                textAlign: 'center',
                bgcolor: isDragOver ? 'primary.50' : 'background.paper',
                transition: 'all 0.2s ease',
                cursor: 'pointer',
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/jpeg,image/jpg,image/png,image/webp"
                style={{ display: 'none' }}
              />

              <Box display="flex" alignItems="center" flexDirection="column">
                {uploadState === 'uploading' && (
                  <>
                    <CircularProgress />
                    <Typography>{tc("uploading")}</Typography>
                  </>
                )}

                {uploadState === 'success' && (
                  <>
                    <CheckCircle color="success" fontSize="large" />
                    <Typography color="success.main">
                      {tc("upload_complete")}
                    </Typography>
                  </>
                )}

                {uploadState === 'error' && (
                  <>
                    <Error color="error" fontSize="large" />
                    <Typography color="error.main">{t("errorupload_error")}</Typography>
                  </>
                )}

                {uploadState === 'idle' && (
                  <>
                    <CloudUpload sx={{ fontSize: 48, color: 'grey.400' }} />
                    <Typography variant="body2" color="text.secondary">
                      {tc("upload_title")}
                    </Typography>
                  </>
                )}
              </Box>
            </Box>
          </Box>
        </Box>

        <Box display="flex" alignItems="center" gap={2}>
          <Typography variant="body1" fontWeight="bold">
            {tc("availability")}
          </Typography>
          <FormControlLabel
            control={
              <Switch
                checked={!form.disabled}
                onChange={(e) => handleChange('disabled', !e.target.checked)}
              />
            }
            label=""
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          {t("buttons.cancel")}
        </Button>
        <Button variant="contained" onClick={handleSubmit}>
          <Save sx={{ mr: 1, verticalAlign: 'middle' }} />
          {isEdit ? tc("update") : tc("create")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ServiceFormModal;
