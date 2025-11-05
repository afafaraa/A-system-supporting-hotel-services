import LoginPage from '../user/LoginPage.tsx';
import { Dialog } from '@mui/material';
import {Room} from "../../types/room.ts";

function LoginDialog({
  selectedRoom,
  setSelectedRoom,
}: {
  selectedRoom: Room | null;
  setSelectedRoom: (open: null) => void;
}) {
  return (
    <Dialog
      sx={{'& .MuiDialog-paper': {borderRadius: '15px'}}}
      open={selectedRoom !== null}
      onClose={() => setSelectedRoom(null)}
    >
      <LoginPage selectedRoom={selectedRoom ?? undefined}/>
    </Dialog>
  );
}

export default LoginDialog;
