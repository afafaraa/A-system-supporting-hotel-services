import {axiosAuthApi} from "../../../middleware/axiosApi.ts";
import {useSelector} from "react-redux";
import {selectUser} from "../../../redux/slices/userSlice.ts";
import {useEffect, useState} from "react";
import AuthenticatedHeader from "../../../components/ui/AuthenticatedHeader.tsx";
import ServiceItem from "./ServiceItem.tsx";
import {useTranslation} from "react-i18next";

export type RequestedServiceProps = {
  id: string;
  name: string;
  employeeId: string;
  employeeFullName: string;
  imageUrl: string;
  price: number;
  datetime: string;
  status: string;
};

function RequestedServicesPage() {
  const user = useSelector(selectUser);
  const [services, setServices] = useState([]);
  const {t} = useTranslation();

  useEffect(() => {
    fetchRequestedServices();
  }, [])

  const fetchRequestedServices = async () => {
    try {
      if (user) {
        const response = await axiosAuthApi.get(`/guest/order/get/all/requested/${user.username}`);
        setServices(response.data);
      }
    } catch (e) {
      console.error(e)
    }
  }

  console.log(services);
  return (
    <div style={{width: '100%'}}>
      <AuthenticatedHeader title={t('pages.requested_services.title')}/>
      {services.length > 0 && services.map((service: RequestedServiceProps, index) => (
        <ServiceItem index={index} item={service} fetchData={fetchRequestedServices}/>
      ))}
    </div>
  )
}

export default RequestedServicesPage;