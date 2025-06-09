import {Dialog, Button} from "@mui/material";
import {axiosAuthApi} from "../../../middleware/axiosApi.ts";
import {useSelector} from "react-redux";
import {selectUser} from "../../../redux/slices/userSlice.ts";

function CancelServiceDialog({open, setOpen, scheduleId, fetchData}: {open: boolean, setOpen: (open: boolean) => void, scheduleId: string, fetchData: () => void}) {
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
      fetchData()
    }
  }

  return (
    <Dialog open={open}>
      <div style={{padding: '15px'}}>
        Are you sure?
        <div style={{marginTop:'10px'}}>
          <Button sx={{marginRight: '5px'}} onClick={cancel}>Cancel service</Button>
          <Button variant="contained" onClick={() => setOpen(false)}>Dont cancel</Button>
        </div>
      </div>
    </Dialog>
  )
}

export default CancelServiceDialog;