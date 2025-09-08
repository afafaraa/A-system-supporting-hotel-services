import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  SelectChangeEvent,
  Typography
} from "@mui/material";
import {useState} from "react";
import {CancellationReason} from "../../types/cancellation_reasons.ts";
import {useTranslation} from "react-i18next";

type Props = {
  onCancel: () => void;
  onConfirm: (reason: CancellationReason) => void;
};

function ConfirmationWithReasonDialog({onCancel, onConfirm}: Props) {
  const [reason, setReason] = useState<CancellationReason | "">("");
  const [error, setError] = useState<boolean>(false);
  const { t } = useTranslation();

  const handleChange = (event: SelectChangeEvent) => {
    setReason(event.target.value as unknown as CancellationReason);
  };

  const handleConfirm = () => {
    if (reason === "") {
      setError(true);
    } else {
      onConfirm(reason)
    }
  }

  const reasonOptions = Object.values(CancellationReason).filter(v => isNaN(Number(v)));


  return (
    <Dialog open={true} onClose={onCancel} sx={{"&	.MuiDialog-paper": {p: {xs: 1, sm: 2}, borderRadius: 3}}}>
      <DialogTitle textAlign="center">{t("confirmation_dialog.title")}</DialogTitle>
      <DialogContent>
        <Typography fontSize={14} mb={2}>Are you sure you want to cancel / reject this service? </Typography>
        <Typography fontSize={14} mb={1}>{t("confirmation_dialog.select_reason")}:</Typography>
        <FormControl fullWidth>
          <InputLabel id="reason-label">Reason</InputLabel>
          <Select
            labelId="reason-label"
            id="demo-simple-select"
            value={reason as string}
            label="Reason"
            onChange={handleChange}
            error={error}
          >
            {reasonOptions.map(reason =>
              <MenuItem value={reason}>
                {t(`cancellation_reasons.${reason}`)}
              </MenuItem>
            )}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} sx={{color: "text.disabled"}}>{t("confirmation_dialog.cancel")}</Button>
        <Button onClick={handleConfirm} color="error" variant="contained">{t("confirmation_dialog.confirm")}</Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmationWithReasonDialog;
