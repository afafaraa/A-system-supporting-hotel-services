import {Grid} from "@mui/material";
import AvailableServiceCard, {ServiceProps} from "./AvailableServiceCard.tsx";
import {axiosAuthApi} from "../../../middleware/axiosApi.ts";
import {useEffect, useState} from "react";

function AvailableServicesPage() {
  const [availableServices, setAvailableServices] = useState<ServiceProps[]>([]);
  const [page] = useState(0);

  const pageSize = 100; // temporary until pagination

  useEffect(() => {
    axiosAuthApi.get(`/services/available?page=${page}&size=${pageSize}`)
      .then(res => {
        console.log(res.data);
        setAvailableServices(res.data);
      })
      .catch(error => {
        console.log(error);
      })
  }, [page]);

  return (
    <main>
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
