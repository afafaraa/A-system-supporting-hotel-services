import LoginPage from '../user/LoginPage.tsx';
import { Dialog } from '@mui/material';

function LoginDialog({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  return (
    <Dialog
      sx={{'& .MuiDialog-paper': {borderRadius: '15px'}}}
      open={open}
      onClose={() => setOpen(false)}
    >
      <LoginPage />
    </Dialog>
  );
}

export default LoginDialog;
