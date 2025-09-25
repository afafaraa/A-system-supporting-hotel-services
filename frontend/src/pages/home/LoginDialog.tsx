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
      sx={{ borderRadius: '10%' }}
      open={open}
      onClose={() => setOpen(false)}
    >
      <LoginPage />
    </Dialog>
  );
}

export default LoginDialog;
