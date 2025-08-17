import { useState, useEffect, useRef } from "react";
import { Service, WeekdayHour } from "../../../types";
import { axiosAuthApi } from "../../../middleware/axiosApi";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  RadioGroup,
  Radio,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Card,
  CardMedia,
  IconButton,
  Chip,
  Stack,
} from "@mui/material";
import {
  CloudUpload,
  Delete,
  Image as ImageIcon,
  CheckCircle,
  Error as ErrorIcon
} from "@mui/icons-material";

type Props = {
  open: boolean;
  initial?: Service;
  onClose: () => void;
  onSaved: (service: Service) => void;
  onDeleted?: (id: string) => void;
};

type UploadState = 'idle' | 'uploading' | 'success' | 'error';

function ServiceForm({ open, initial, onClose, onSaved, onDeleted }: Props) {
  const isEdit = Boolean(initial?.id);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<Service>({
    name: "",
    description: "",
    price: 0,
    type: "GENERAL_SERVICE",
    disabled: false,
    duration: 60,
    maxAvailable: 1,
    weekday: [],
    image: "",
  });

  const [saving, setSaving] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteOption, setDeleteOption] = useState<number>(1);
  const [deleting, setDeleting] = useState(false);

  const [uploadState, setUploadState] = useState<UploadState>('idle');
  const [uploadError, setUploadError] = useState<string>("");
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isDragOver, setIsDragOver] = useState(false);

  useEffect(() => {
    if (open) {
      if (initial) {
        setForm(initial);
        setPreviewUrl(initial.image || "");
      } else {
        setForm({
          name: "",
          description: "",
          price: 0,
          type: "GENERAL_SERVICE",
          disabled: false,
          duration: 60,
          maxAvailable: 1,
          weekday: [],
          image: "",
        });
        setPreviewUrl("");
      }
      setUploadState('idle');
      setUploadError("");
    }
  }, [open, initial]);

  const handleChange = (k: keyof Service, v: unknown) => {
    setForm((prev) => ({ ...prev, [k]: v }));
  };

  const changeWeekday = (index: number, k: keyof WeekdayHour, v: unknown) => {
    const newWeekday = [...form.weekday];
    newWeekday[index] = { ...newWeekday[index], [k]: v };
    setForm((prev) => ({ ...prev, weekday: newWeekday }));
  };

  const addWeekday = () => {
    setForm((prev) => ({
      ...prev,
      weekday: [
        ...(prev.weekday ?? []),
        { day: "MONDAY", startHour: 0, endHour: 0 },
      ],
    }));
  };

  const removeWeekday = (index: number) => {
    setForm((prev) => ({
      ...prev,
      weekday: prev.weekday.filter((_, i) => i !== index),
    }));
  };

  const validateFile = (file: File): string | null => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(file.type)) {
      return "Dozwolone są tylko pliki JPG, PNG i WebP";
    }

    if (file.size > maxSize) {
      return "Plik nie może być większy niż 10MB";
    }

    return null;
  };

  const uploadImage = async (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setUploadError(validationError);
      setUploadState('error');
      return;
    }

    setUploadState('uploading');
    setUploadError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axiosAuthApi.post<{ downloadUri: string }>(
          "/uploads/image",
          formData,
      );

      const imageUrl = response.data.downloadUri;
      console.log("Upload response:", response.data);
      console.log("Image URL:", imageUrl);
      const fullImageUrl = imageUrl.startsWith('http')
        ? imageUrl
        : `${window.location.origin}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
      handleChange("image", imageUrl);
      setPreviewUrl(fullImageUrl);
      setUploadState('success');

      setTimeout(() => {
        if (uploadState !== 'error') {
          setUploadState('idle');
        }
      }, 2000);

    } catch (error: unknown) {
      console.error("Upload error:", error);
      let errorMessage = "Błąd podczas uploadu";
      if (typeof error === "object" && error !== null && "response" in error) {
        const err = error as { response?: { data?: { error?: string } } };
        errorMessage = err.response?.data?.error || errorMessage;
      }
      setUploadError(errorMessage);
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
    const imageFile = files.find(file => file.type.startsWith('image/'));

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

  const handleRemoveImage = async () => {
    if (form.image && form.image.startsWith('/uploads/')) {
      try {
        const fileName = form.image.split('/').pop();
        await axiosAuthApi.delete(`/uploads/files/${fileName}`);
      } catch (error) {
        console.error("Error deleting file:", error);
      }
    }

    handleChange("image", "");
    setPreviewUrl("");
    setUploadState('idle');
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUrlChange = (url: string) => {
    handleChange("image", url);
    setPreviewUrl(url);
    setUploadState('idle');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = isEdit ? `/services/${initial?.id}` : "/services";
      const method = isEdit ? "patch" : "post";
      const payload = {
        ...form,
        rating: isEdit ? form.rating ?? [] : [],
      };

      const res = await axiosAuthApi[method]<Service>(url, payload);
      onSaved(res.data);
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClick = () => {
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!initial?.id) return;

    setDeleting(true);
    try {
      await axiosAuthApi.delete(
          `/services/${initial.id}?deleteOption=${deleteOption}`
      );
      onDeleted?.(initial.id);
      setDeleteModalOpen(false);
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setDeleteOption(1);
  };

  return (
      <>
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
          <DialogTitle>
            <Stack direction="row" alignItems="center" spacing={1}>
              <ImageIcon />
              <span>{isEdit ? "Edytuj Usługę" : "Dodaj Usługę"}</span>
            </Stack>
          </DialogTitle>

          <DialogContent>
            <Box
                component="form"
                id="service-form"
                display="flex"
                flexDirection="column"
                gap={3}
                mt={2}
            >
              <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
                <TextField
                    label="Nazwa"
                    value={form.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    required
                    fullWidth
                />
                <TextField
                    label="Cena"
                    type="number"
                    value={form.price}
                    onChange={(e) =>
                        handleChange("price", parseFloat(e.target.value) || 0)
                    }
                    required
                    fullWidth
                    InputProps={{
                      endAdornment: "PLN"
                    }}
                />
              </Box>

              <TextField
                  label="Opis"
                  value={form.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  multiline
                  rows={3}
                  fullWidth
              />

              <Box display="grid" gridTemplateColumns="1fr 1fr 1fr" gap={2}>
                <TextField
                    label="Czas trwania (min)"
                    type="number"
                    value={form.duration}
                    onChange={(e) =>
                        handleChange("duration", parseInt(e.target.value) || 60)
                    }
                    fullWidth
                />
                <TextField
                    label="Max dostępnych"
                    type="number"
                    value={form.maxAvailable}
                    onChange={(e) =>
                        handleChange("maxAvailable", parseInt(e.target.value) || 1)
                    }
                    fullWidth
                />
                <FormControl fullWidth>
                  <InputLabel>Typ</InputLabel>
                  <Select
                      label="Typ"
                      value={form.type}
                      onChange={(e) => handleChange("type", e.target.value)}
                  >
                    <MenuItem value="GENERAL_SERVICE">Usługa Ogólna</MenuItem>
                    <MenuItem value="PLACE_RESERVATION">Rezerwacja Miejsca</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <FormControlLabel
                  control={
                    <Switch
                        checked={form.disabled}
                        onChange={(e) => handleChange("disabled", e.target.checked)}
                    />
                  }
                  label={
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <span>{form.disabled ? "Wyłączona" : "Dostępna"}</span>
                      <Chip
                          size="small"
                          label={form.disabled ? "DISABLED" : "ACTIVE"}
                          color={form.disabled ? "error" : "success"}
                          variant="outlined"
                      />
                    </Stack>
                  }
              />

              <Box>
                <Typography variant="h6" gutterBottom>
                  Zdjęcie Usługi
                </Typography>

                {previewUrl && (
                    <Card sx={{ mb: 2, position: "relative", maxWidth: 400 }}>
                      <CardMedia
                          component="img"
                          height="250"
                          image={previewUrl}
                          alt="Podgląd usługi"
                          sx={{ objectFit: "cover" }}
                          onError={() => {
                            setPreviewUrl("");
                            setUploadError("Nie można załadować obrazu");
                            setUploadState('error');
                          }}
                      />
                      <IconButton
                          onClick={handleRemoveImage}
                          sx={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            bgcolor: "rgba(0,0,0,0.6)",
                            color: "white",
                            "&:hover": { bgcolor: "rgba(0,0,0,0.8)" },
                          }}
                          size="small"
                      >
                        <Delete />
                      </IconButton>
                    </Card>
                )}

                <Box
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    sx={{
                      border: 2,
                      borderStyle: "dashed",
                      borderColor: isDragOver ? "primary.main" : "grey.300",
                      borderRadius: 2,
                      p: 3,
                      textAlign: "center",
                      bgcolor: isDragOver ? "primary.50" : "background.paper",
                      transition: "all 0.2s ease",
                      cursor: "pointer",
                    }}
                    onClick={() => fileInputRef.current?.click()}
                >
                  <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileSelect}
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      style={{ display: "none" }}
                  />

                  <Stack spacing={2} alignItems="center">
                    {uploadState === 'uploading' && (
                        <>
                          <CircularProgress />
                          <Typography>Uploading...</Typography>
                        </>
                    )}

                    {uploadState === 'success' && (
                        <>
                          <CheckCircle color="success" sx={{ fontSize: 48 }} />
                          <Typography color="success.main">Upload zakończony!</Typography>
                        </>
                    )}

                    {uploadState === 'error' && (
                        <>
                          <ErrorIcon color="error" sx={{ fontSize: 48 }} />
                          <Typography color="error.main">Błąd uploadu</Typography>
                        </>
                    )}

                    {uploadState === 'idle' && (
                        <>
                          <CloudUpload sx={{ fontSize: 48, color: "grey.400" }} />
                          <Typography variant="h6">
                            Przeciągnij zdjęcie tutaj lub kliknij
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            JPG, PNG, WebP • Max 10MB
                          </Typography>
                        </>
                    )}
                  </Stack>
                </Box>

                {!previewUrl && (
                    <Box mt={2}>
                      <Typography variant="body2" color="text.secondary" align="center" mb={1}>
                        lub
                      </Typography>
                      <TextField
                          label="Podaj URL zdjęcia"
                          value={form.image}
                          onChange={(e) => handleUrlChange(e.target.value)}
                          fullWidth
                          size="small"
                          placeholder="https://example.com/image.jpg"
                      />
                    </Box>
                )}

                {uploadError && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                      {uploadError}
                    </Alert>
                )}
              </Box>

              <Box>
                <Typography variant="h6" gutterBottom>
                  Godziny Dostępności
                </Typography>

                <Button
                    onClick={addWeekday}
                    variant="outlined"
                    sx={{ mb: 2 }}
                    startIcon={<ImageIcon />}
                >
                  Dodaj dzień
                </Button>

                <Stack spacing={2}>
                  {Array.isArray(form.weekday) &&
                      form.weekday.map((wd, index) => (
                          <Card key={index} variant="outlined" sx={{ p: 2 }}>
                            <Box display="grid" gridTemplateColumns="2fr 1fr 1fr auto" gap={2} alignItems="center">
                              <FormControl>
                                <InputLabel>Dzień</InputLabel>
                                <Select
                                    label="Dzień"
                                    value={wd.day}
                                    onChange={(e) =>
                                        changeWeekday(index, "day", e.target.value)
                                    }
                                >
                                  {[
                                    { value: "MONDAY", label: "Poniedziałek" },
                                    { value: "TUESDAY", label: "Wtorek" },
                                    { value: "WEDNESDAY", label: "Środa" },
                                    { value: "THURSDAY", label: "Czwartek" },
                                    { value: "FRIDAY", label: "Piątek" },
                                    { value: "SATURDAY", label: "Sobota" },
                                    { value: "SUNDAY", label: "Niedziela" },
                                  ].map((day) => (
                                      <MenuItem key={day.value} value={day.value}>
                                        {day.label}
                                      </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>

                              <TextField
                                  label="Od"
                                  type="time"
                                  value={wd.startHour.toString().padStart(2, "0") + ":00"}
                                  onChange={(e) => {
                                    const hour = parseInt(e.target.value.split(":")[0], 10);
                                    changeWeekday(index, "startHour", hour);
                                  }}
                              />

                              <TextField
                                  label="Do"
                                  type="time"
                                  value={wd.endHour.toString().padStart(2, "0") + ":00"}
                                  onChange={(e) => {
                                    const hour = parseInt(e.target.value.split(":")[0], 10);
                                    changeWeekday(index, "endHour", hour);
                                  }}
                              />

                              <IconButton
                                  onClick={() => removeWeekday(index)}
                                  color="error"
                                  size="small"
                              >
                                <Delete />
                              </IconButton>
                            </Box>
                          </Card>
                      ))}
                </Stack>
              </Box>
            </Box>
          </DialogContent>

          <DialogActions sx={{ p: 3 }}>
            <Box display="flex" width="100%" justifyContent="space-between">
              <Box>
                {isEdit && (
                    <Button
                        onClick={handleDeleteClick}
                        variant="outlined"
                        color="error"
                        disabled={saving}
                        startIcon={<Delete />}
                    >
                      Usuń
                    </Button>
                )}
              </Box>
              <Stack direction="row" spacing={1}>
                <Button
                    onClick={onClose}
                    disabled={saving || uploadState === 'uploading'}
                >
                  Anuluj
                </Button>
                <Button
                    form="service-form"
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={saving || uploadState === 'uploading'}
                    onClick={handleSubmit}
                    startIcon={saving ? <CircularProgress size={16} /> : null}
                >
                  {saving ? "Zapisywanie..." : isEdit ? "Zapisz" : "Utwórz"}
                </Button>
              </Stack>
            </Box>
          </DialogActions>
        </Dialog>

        <Dialog
            open={deleteModalOpen}
            onClose={handleDeleteCancel}
            maxWidth="sm"
            fullWidth
        >
          <DialogTitle>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Delete color="error" />
              <span>Usuń Usługę</span>
            </Stack>
          </DialogTitle>
          <DialogContent>
            <Alert severity="warning" sx={{ mb: 2 }}>
              <Typography variant="body1" gutterBottom>
                Czy na pewno chcesz usunąć tę usługę? Ta akcja jest nieodwracalna.
              </Typography>
            </Alert>

            <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mt: 2 }}>
              Wybierz co zrobić z powiązanymi zamówieniami:
            </Typography>

            <RadioGroup
                value={deleteOption}
                onChange={(e) => setDeleteOption(parseInt(e.target.value))}
                sx={{ mt: 1 }}
            >
              <FormControlLabel
                  value={1}
                  control={<Radio />}
                  label="Usuń dostępne i żądane zamówienia"
              />
              <FormControlLabel
                  value={2}
                  control={<Radio />}
                  label="Usuń tylko dostępne zamówienia"
              />
            </RadioGroup>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteCancel} disabled={deleting}>
              Anuluj
            </Button>
            <Button
                onClick={handleDeleteConfirm}
                variant="contained"
                color="error"
                disabled={deleting}
                startIcon={deleting ? <CircularProgress size={16} /> : <Delete />}
            >
              {deleting ? "Usuwanie..." : "Usuń Usługę"}
            </Button>
          </DialogActions>
        </Dialog>
      </>
  );
}

export default ServiceForm;