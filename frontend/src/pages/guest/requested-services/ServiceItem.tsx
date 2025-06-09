import {Typography, Button, Box} from "@mui/material";
import {RequestedServiceProps} from "./RequestedServicesPage.tsx";
import {useState} from "react";
import RateServiceDialog from "./RateServiceDialog.tsx";
import CancelServiceDialog from "./CancelServiceDialog.tsx";
import {useTranslation} from "react-i18next";

function ServiceItem ({item, index, fetchData}: {item: RequestedServiceProps, index: number, fetchData: () => void}) {
  const [openRate, setOpenRate] = useState(false);
  const [openCancel, setOpenCancel] = useState(false);
  const {t} = useTranslation();

  return (
    <div key={index} style={{display: 'flex', marginTop: '10px', padding: '15px', background: 'white'}}>
      <RateServiceDialog open={openRate} setOpen={setOpenRate} scheduleId={item.id} fetchData={fetchData}/>
      <CancelServiceDialog open={openCancel} setOpen={setOpenCancel} scheduleId={item.id} fetchData={fetchData}/>
      <img style={{height: '120px', aspectRatio: '1 / 1', objectFit: 'cover', display: 'block'}} src={item.imageUrl} alt="img"/>
      <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '100%', padding: {xs: '0 10px', sm: '5px 20px'}}}>
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
          <div>
            <Typography sx={{fontSize: {xs: '1em', sm: '1.5em'}}} variant="h5">{item.name}</Typography>
            <Typography sx={{lineHeight: '14px', fontSize: {xs: '0.8em', sm: '1em'}}} variant="body2">{item.employeeFullName}</Typography>
            <div style={{ color: item.status === "CANCELED" ? 'red' : item.status === "IN_PROGRESS" || item.status === "FINISHED" ? 'green' : 'orange' }}>
              {t(`pages.past_services.${item.status}`)}
            </div>
          </div>
          <div style={{fontWeight: '700'}}>{item.price}$</div>
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'end'}}>
          <div>{(new Date(item.datetime)).toLocaleDateString()} : {(new Date(item.datetime)).toLocaleTimeString().slice(0,5)}</div>
          {(item.status === "IN_PROGRESS" || item.status === "PENDING") ? (
            <Button variant="contained" disabled={(new Date(item.datetime).getTime() - Date.now() < 60 * 60 * 1000) || item.status === "IN_PROGRESS"} onClick={() => setOpenCancel(true)}>{t('buttons.cancel')}</Button>
          ) : (
            <Button variant="contained" disabled={item.status === "CANCELED"} onClick={() => setOpenRate(true)}>{t('pages.past_services.rate')}</Button>
          )}
          </div>
      </Box>
    </div>
  )
}

export default ServiceItem;