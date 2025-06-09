import {Typography, Button} from "@mui/material";
import {RequestedServiceProps} from "./RequestedServicesPage.tsx";
import {useState} from "react";
import RateServiceDialog from "./RateServiceDialog.tsx";
import CancelServiceDialog from "./CancelServiceDialog.tsx";

function ServiceItem ({item, index, fetchData}: {item: RequestedServiceProps, index: number, fetchData: () => void}) {
  const [openRate, setOpenRate] = useState(false);
  const [openCancel, setOpenCancel] = useState(false);

  return (
    <div key={index} style={{display: 'flex', marginTop: '10px', padding: '15px', background: 'white'}}>
      <RateServiceDialog open={openRate} setOpen={setOpenRate} scheduleId={item.id} fetchData={fetchData}/>
      <CancelServiceDialog open={openCancel} setOpen={setOpenCancel} scheduleId={item.id} fetchData={fetchData}/>
      <img style={{height: '120px', aspectRatio: '1 / 1', objectFit: 'cover', display: 'block'}} src={item.imageUrl} alt="img"/>
      <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '100%', padding: '5px 20px'}}>
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
          <div>
            <Typography variant="h5">{item.name}</Typography>
            <Typography sx={{lineHeight: '14px'}} variant="body2">{item.employeeFullName}</Typography>
            <div>{item.status}</div>
          </div>
          <div style={{fontWeight: '700'}}>{item.price}$</div>
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'end'}}>
          <div>{(new Date(item.datetime)).toLocaleDateString()} : {(new Date(item.datetime)).toLocaleTimeString().slice(0,5)}</div>
          {(item.status === "IN_PROGRESS" || item.status === "PENDING") ? (
            <Button variant="contained" disabled={(new Date(item.datetime).getTime() - Date.now() < 60 * 60 * 1000) || item.status === "IN_PROGRESS"} onClick={() => setOpenCancel(true)}>Cancel</Button>
          ) : (
            <Button variant="contained" disabled={item.status === "CANCELED"} onClick={() => setOpenRate(true)}>Rate</Button>
          )}
          </div>
      </div>
    </div>
  )
}

export default ServiceItem;