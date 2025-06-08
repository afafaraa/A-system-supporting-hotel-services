import {Dialog, Button} from "@mui/material";
import {axiosAuthApi} from "../../../middleware/axiosApi.ts";
import {useSelector} from "react-redux";
import {selectUser} from "../../../redux/slices/userSlice.ts";

function CancelServiceDialog({open, setOpen, scheduleId}: {open: boolean, setOpen: (open: boolean) => void, scheduleId: string}) {
  const user = useSelector(selectUser);

  const cancel = async () => {
    try {
      await axiosAuthApi.post("/guest/order/cancel", {
        username: user?.username,
        orderId: scheduleId,
      })
    } catch (e) {
      console.error(e)
    } finally {
      setOpen(false)
    }
  }

  return (
    <Dialog open={open}>
      <div>
        Are you sure?
        <div>
          <Button onClick={cancel}>Cancel service</Button>
          <Button onClick={() => setOpen(false)}>Dont cancel</Button>
        </div>
      </div>
    </Dialog>
  )
}

export default CancelServiceDialog;