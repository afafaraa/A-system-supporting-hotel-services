import {axiosAuthApi} from "../../middleware/axiosApi.ts";
import {useSelector} from "react-redux";
import {selectUser} from "../../redux/slices/userSlice.ts";
import {useEffect, useState} from "react";
import PageContainer from "../../components/layout/PageContainer.tsx";

type RequestedServiceProps = {
  id: string;
  scheduleId: string;
  orderDate: string;
  orderForDate: string;
  status: string;
};

function RequestedServicesPage() {
  const user = useSelector(selectUser);
  const [services, setServices] = useState([]);

  useEffect(() => {
    fetchRequestedServices();
  }, [])

  const fetchRequestedServices = async () => {
    try {
      if (user) {
        const response = await axiosAuthApi.get(`/guest/order/get/all/pending/${user.username}`);
        console.log(response.data);
        setServices(response.data);
      }
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <PageContainer title={"Oczekujące usługi"}>
      {services.length === 0 ?
        <p>Nie masz żadnych oczekujących usług</p>
        :
        <>
          {services.length > 0 && services.map((service: RequestedServiceProps, index) => (
            <div key={index}>{service.id}</div>
          ))}
        </>
      }
    </PageContainer>
  )
}

export default RequestedServicesPage;