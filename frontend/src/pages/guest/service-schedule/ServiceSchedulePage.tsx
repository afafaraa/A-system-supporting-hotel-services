import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {axiosAuthApi} from "../../../middleware/axiosApi.ts";
import AuthenticatedHeader from "../../../components/layout/AuthenticatedHeader.tsx";
import {Grid, Box} from "@mui/material";
import {ServiceProps} from "../available-services/AvailableServiceCard.tsx";
import ScheduleForDate from "./ScheduleForDay.tsx";
import StarRating from "../available-services/StarRating.tsx";
import {useTranslation} from "react-i18next";

function ServiceSchedulePage (){
  const params = useParams();
  const [service, setService] = useState<ServiceProps>();
  const [loading, setLoading] = useState(false);
  const {t} = useTranslation();

  useEffect(()=>{
    fetchServiceData();
  }, [])

  const fetchServiceData = async () => {
    setLoading(true);
    try {
      const response = await axiosAuthApi.get(`/services/one/${params.id}`);
      setService(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }

  }

  if(loading || service == null){
    return <p>Loading...</p>;
  }
  return (
    <div style={{width:'100%'}}>
      <AuthenticatedHeader title={service.name} />
      <Box sx={{width: '100%', backgroundColor: 'white', borderRadius: '10px', margin: '20px 0', padding: {xs: '20px', sm: '30px', md: '60px'}}}>
        <Grid  sx={{gap: 2}} container spacing={{xs: 2, md: 3}} columns={{ xs: 1, sm: 2}}>
          <Grid order={{xs: 2, sm: 1}} size={1}>
            <h4 style={{fontSize: '1.5em', marginBottom: '5px'}}>{t('pages.service_schedule.nextAvailableServices')}</h4>
            <ScheduleForDate service={service}/>
          </Grid>
          <Grid order={{xs: 1, sm: 2}} sx={{display: 'flex', flexDirection: 'column', gap: '10px'}} size={1}>
            <img style={{maxHeight: '70%', aspectRatio: '1 / 1', objectFit: 'cover', display: 'block'}} src={service.image} alt="Alt"/>
            <div >{service.description}</div>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              {service.rating && <StarRating rating={service.rating}/>}
              <div style={{fontWeight: 'bold'}}>{service.price}$</div>
            </div>
          </Grid>
        </Grid>
      </Box>
      <div style={{padding: '10px'}}>
        <p style={{fontSize: '24px', fontWeight:'bold'}}>Guest Reviews</p>
        {service.rating.map((it, index) => (
          <Box key={index} sx={{width: {xs:'100%', sm: '60%'}, background: 'white', padding: '15px 20px', marginTop: '8px'}}>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
              <div>{it.fullName}</div>
              <StarRating rating={[it]}/>
            </div>
            {it.comment === null || it.comment.length > 0 ? (<div>({it.fullName} left no comment)</div>) : (
              <div>{it.comment}</div>
            )}
          </Box>
        ))}
      </div>

    </div>
  )
}

export default ServiceSchedulePage;
