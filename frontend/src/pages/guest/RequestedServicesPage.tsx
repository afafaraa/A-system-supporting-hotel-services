import {axiosAuthApi} from "../../middleware/axiosApi.ts";
import {useSelector} from "react-redux";
import {selectUser} from "../../redux/slices/userSlice.ts";
import {useEffect, useState} from "react";
import AuthenticatedHeader from "../../components/layout/AuthenticatedHeader.tsx";

function RequestedServicesPage() {
  const user = useSelector(selectUser);
  const [services, setServices] = useState([]);

  useEffect(() => {
    fetchRequestedServices();
  }, [])

  const fetchRequestedServices = async () => {
    try {
      const response = await axiosAuthApi.get(`/guest/order/get/all/pending/${user.username}`);
      console.log(response.data);
      setServices(response.data);
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div style={{width: '100%'}}>
      <AuthenticatedHeader title={"Oczekujące usługi"}/>
      {services.length > 0 && services.map((service, index) => (
        <div key={index}>{service.id}</div>
      ))}
    </div>
  )
}

export default RequestedServicesPage;