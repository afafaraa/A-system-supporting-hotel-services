import {axiosAuthApi} from "../../../middleware/axiosApi.ts";
import {useSelector} from "react-redux";
import {selectUser} from "../../../redux/slices/userSlice.ts";
import { useCallback, useEffect, useState } from 'react';
import ServiceItem from "./ServiceItem.tsx";
import { Box } from '@mui/material';

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
function BookedServicesPage() {
  const user = useSelector(selectUser);
  const [services, setServices] = useState<RequestedServiceProps[]>([]);

  const fetchRequestedServices = useCallback(async () => {
    try {
      if (user) {
        const response = await axiosAuthApi.get(
          `/guest/order/get/all/requested/${user.username}`
        );
        setServices(response.data);
      }
    } catch (e) {
      console.error(e);
    }
  }, [user]);

  useEffect(() => {
    fetchRequestedServices();
  }, [fetchRequestedServices]);

  return (
    <Box sx={{ width: "100%", p: 2 }}>
      {services.length > 0 &&
        services.map((service, index) => (
          <ServiceItem
            key={index}
            index={index}
            item={service}
            fetchData={fetchRequestedServices}
          />
        ))}
    </Box>
  );
}

export default BookedServicesPage;