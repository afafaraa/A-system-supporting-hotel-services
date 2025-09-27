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
  const tc = (key: string) => t(`pages.employee.confirmation_dialog.${key}`);

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
    <Dialog open={true} onClose={onCancel} sx={{"& .MuiDialog-paper": {p: {xs: 1, sm: 2}, borderRadius: 3}}}>
      <DialogTitle textAlign="center">{tc("title")}</DialogTitle>
      <DialogContent>
        <Typography fontSize={14} mb={2}>{tc("description")}</Typography>
        <FormControl fullWidth>
          <InputLabel id="reason-label">{tc("reason")}</InputLabel>
          <Select
            labelId="reason-label"
            id="demo-simple-select"
            value={reason as string}
            label={tc("reason")}
            onChange={handleChange}
            error={error}
            sx={{
              borderRadius: "12px",
              bgcolor: "background.default",
              '& .MuiOutlinedInput-notchedOutline': {borderColor: 'background.default', borderRadius: "12px"},
              '& .MuiInputBase-input': { fontSize: "90%" },
            }}
          >
            {reasonOptions.map((reason, index) =>
              <MenuItem key={index} value={reason}>
                {tc(`reasons.${reason}`)}
              </MenuItem>
            )}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} sx={{color: "text.disabled"}}>{tc("cancel")}</Button>
        <Button onClick={handleConfirm} color="error" variant="contained">{tc("confirm")}</Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmationWithReasonDialog;
