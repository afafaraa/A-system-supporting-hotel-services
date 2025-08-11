import {Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, FormControl, Select, InputLabel, MenuItem, SelectChangeEvent} from "@mui/material";
import {useState} from "react";
import {CancellationReason} from "../../types/cancellation_reasons.ts";
import {useTranslation} from "react-i18next";

type Props = {
  open: boolean;
  title: string;
  description: string;
  onCancel: () => void;
  onConfirm: (reason: CancellationReason) => void;
  confirmText: string;
  cancelText: string;
};

function ConfirmationWithReasonDialog({open, title, description, onCancel, onConfirm, confirmText, cancelText}: Props) {
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
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText gutterBottom>{description}</DialogContentText>
        <DialogContentText gutterBottom>Select a reason:</DialogContentText>
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
        <Button onClick={onCancel} sx={{color: "darkslategray"}}>{cancelText}</Button>
        <Button onClick={handleConfirm} color="error" variant="contained">
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmationWithReasonDialog;
