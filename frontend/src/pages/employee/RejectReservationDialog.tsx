import {Button, Dialog, TextField, Typography} from "@mui/material";
import Box from "@mui/system/Box";
import {ChangeEvent, useState} from "react";
import {useTranslation} from "react-i18next";

interface Props {
  opened: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  actionLoading: boolean;
}

function RejectReservationDialog({opened, onClose, onConfirm, actionLoading}: Props) {
  const {t} = useTranslation();
  const tc = (key: string) => t(`pages.employee.reservations.reject-dialog.${key}`);
  const [rejectReason, setRejectReason] = useState("");
  const [dialogTextFieldError, setDialogTextFieldError] = useState(false);

  const localOnClose = () => {
    setRejectReason("");
    setDialogTextFieldError(false);
    onClose();
  }

  const localOnConfirm = () => {
    if (rejectReason.trim() === '') {
      setDialogTextFieldError(true);
      return;
    }
    onConfirm(rejectReason);
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (dialogTextFieldError) setDialogTextFieldError(false);
    setRejectReason(event.target.value as string);
  };

  return (
    <Dialog open={opened} onClose={localOnClose} sx={{"& .MuiDialog-paper": {p: {xs: 1, sm: 4}, borderRadius: 3}}}>
      <Typography fontSize="1.25rem" fontWeight="500" mb={2}>{tc("title")}</Typography>
      <TextField fullWidth required multiline rows={3}
                 label={tc("rejection-reason")}
                 error={dialogTextFieldError && rejectReason.trim() === ''}
                 value={rejectReason} onChange={handleChange}
                 sx={{
                   borderRadius: "12px",
                   bgcolor: "background.default",
                   '& .MuiOutlinedInput-notchedOutline': {borderColor: 'background.default', borderRadius: "12px"},
                   '& .MuiInputBase-input': { fontSize: "90%" },
                 }}
      />
      <Box textAlign="right" mt={3}>
        <Button onClick={localOnClose} loading={actionLoading}
                sx={{color: "text.disabled", mr: 1}}>{t("buttons.cancel")}</Button>
        <Button onClick={localOnConfirm} loading={actionLoading}
                color="error" variant="contained">{t("buttons.confirm")}</Button>
      </Box>
    </Dialog>
  );
}

export default RejectReservationDialog;
