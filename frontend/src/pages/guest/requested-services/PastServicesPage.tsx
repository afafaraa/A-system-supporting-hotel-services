import {axiosAuthApi} from "../../../middleware/axiosApi.ts";
import {useSelector} from "react-redux";
import {selectUser} from "../../../redux/slices/userSlice.ts";
import {useEffect, useState} from "react";
import AuthenticatedHeader from "../../../components/layout/AuthenticatedHeader.tsx";
import ServiceItem from "./ServiceItem.tsx";

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

function PastServicesPage() {
  const user = useSelector(selectUser);
  const [services, setServices] = useState([]);

  useEffect(() => {
    fetchRequestedServices();
  }, [])

  const fetchRequestedServices = async () => {
    try {
      if (user) {
        const response = await axiosAuthApi.get(`/guest/order/get/all/past/${user.username}`);
        setServices(response.data);
        console.log(response.data);
      }
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div style={{width: '100%'}}>
      <AuthenticatedHeader title={"Historyczne usługi"}/>
      {services.length > 0 && services.map((service: RequestedServiceProps, index) => (
        <ServiceItem index={index} item={service} fetchData={fetchRequestedServices}/>
      ))}
    </div>
  )
}

export default PastServicesPage;