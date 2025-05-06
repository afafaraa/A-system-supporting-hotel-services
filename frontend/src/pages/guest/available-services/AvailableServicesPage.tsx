import {Box, Grid} from "@mui/material";
import AvailableServiceCard from "./AvailableServiceCard.tsx";
import {axiosAuthApi} from "../../../middleware/axiosApi.ts";
import {useEffect, useState} from "react";

function AvailableServicesPage() {
  const [availableServices, setAvailableServices] = useState([]);
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
    <div style={{width: '100%'}}>
      <header style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%'}}>
        <h1>Available services</h1>
        <Box sx={{display: {xs: 'none',md: 'flex'}, alignItems: 'center', gap: '10px'}}>
          <h3>MyHotelAssistant</h3>
          <div>Icon</div>
        </Box>
      </header>
      <main style={{marginTop: '20px', }}>
        <Grid sx={{gap: 2}} container spacing={{xs: 2, md: 3}} columns={{ xs: 1, sm: 2, md: 4}}>
          {availableServices.map((service, index) => (
            <Grid key={index} size={1}>
              <AvailableServiceCard service={service}/>
            </Grid>
          ))}
        </Grid>
      </main>
    </div>
  )
}

export default AvailableServicesPage;
