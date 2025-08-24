import {Grid} from "@mui/material";
import AvailableServiceCard, {ServiceProps} from "./AvailableServiceCard.tsx";
import {axiosAuthApi} from "../../../middleware/axiosApi.ts";
import {useEffect, useState} from "react";
import AuthenticatedHeader from "../../../components/layout/AuthenticatedHeader.tsx";
import {useTranslation} from "react-i18next";

function AvailableServicesPage() {
  const [availableServices, setAvailableServices] = useState<ServiceProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [page] = useState(0);
  const { t } = useTranslation();

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
      <AuthenticatedHeader title={t('pages.available_services.title')}/>
      <main style={{marginTop: '20px', marginBottom: '40px'}}>
        <Grid container spacing={{xs: 2, md: 3}} columns={{ xs: 1, sm: 2, md: 4}}>
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
