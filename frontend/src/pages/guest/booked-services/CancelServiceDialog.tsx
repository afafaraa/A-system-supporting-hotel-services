import {Dialog, Button} from "@mui/material";
import {axiosAuthApi} from "../../../middleware/axiosApi.ts";
import {useSelector} from "react-redux";
import {selectUser} from "../../../redux/slices/userSlice.ts";
import {useTranslation} from "react-i18next";

function CancelServiceDialog({open, setOpen, scheduleId, fetchData}: {open: boolean, setOpen: (open: boolean) => void, scheduleId: string, fetchData: () => void}) {
  const user = useSelector(selectUser);
  const { t } = useTranslation();

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
      <div style={{padding: '20px', textAlign: 'center', fontSize: '20px'}}>
        {t('pages.requested_services.confirmationDialog')}
        <div style={{marginTop:'15px'}}>
          <Button sx={{marginRight: '10px'}} onClick={cancel}>{t('pages.requested_services.yes')}</Button>
          <Button variant="contained" onClick={() => setOpen(false)}>{t('pages.requested_services.no')}</Button>
        </div>
      </div>
    </Dialog>
  )
}

export default CancelServiceDialog;