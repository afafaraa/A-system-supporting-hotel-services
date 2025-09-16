import {Grid} from "@mui/material";
import AvailableServiceCard, {ServiceProps} from "./AvailableServiceCard.tsx";
import {axiosAuthApi} from "../../../middleware/axiosApi.ts";
import {useEffect, useState} from "react";

function AvailableServicesPage() {
  const [availableServices, setAvailableServices] = useState<ServiceProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [page] = useState(0);

  const pageSize = 100; // temporary until pagination

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axiosAuthApi.get(`/services/available?page=${page}&size=${pageSize}`)
      console.log(res.data)
      setAvailableServices(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <p>Loading...</p>
  }
  return (
    <main style={{marginTop: '40px', marginBottom: '40px', width: '100%'}}>
      <Grid container spacing={{xs: 1, md: 2}} columns={{ xs: 1, sm: 2, lg: 3}}>
        {availableServices.map((service, index) => (
          <Grid key={index} size={1}>
            <AvailableServiceCard service={service}/>
          </Grid>
        ))}
      </Grid>
    </main>
  );
}

export default AvailableServicesPage;
