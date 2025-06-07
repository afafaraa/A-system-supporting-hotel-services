import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {axiosAuthApi} from "../../../middleware/axiosApi.ts";
import AuthenticatedHeader from "../../../components/layout/AuthenticatedHeader.tsx";
import {Grid} from "@mui/material";
import {ServiceProps} from "../available-services/AvailableServiceCard.tsx";
import ScheduleForDate from "./ScheduleForDay.tsx";
import StarRating from "../available-services/StarRating.tsx";

function ServiceSchedulePage (){
  const params = useParams();
  const [service, setService] = useState<ServiceProps>();
  const [loading, setLoading] = useState(false);

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
      <main style={{width: '100%', backgroundColor: 'white', borderRadius: '10px', padding: '60px 60px'}}>
        <Grid  sx={{gap: 2, }} container spacing={{xs: 2, md: 3}} columns={{ xs: 1, sm: 2}}>
          <Grid size={1}>
            <h4 style={{fontSize: '1.5em', marginBottom: '5px'}}>Najbliższe terminy</h4>
            <ScheduleForDate service={service}/>
          </Grid>
          <Grid sx={{display: 'flex', flexDirection: 'column', gap: '10px'}} size={1}>
            <img style={{maxHeight: '70%', aspectRatio: '1 / 1', objectFit: 'cover', display: 'block'}} src={service.image} alt="Alt"/>
            <div >{service.description}</div>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              {service.rating && <StarRating rating={service.rating}/>}
              <div style={{fontWeight: 'bold'}}>{service.price}$</div>
            </div>
          </Grid>
        </Grid>

      </main>

    </div>
  )
}

export default ServiceSchedulePage;
