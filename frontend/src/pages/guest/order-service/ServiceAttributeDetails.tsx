import {ServiceProps} from "../available-services/AvailableServiceCard.tsx";
import {useEffect, useState} from "react";
import {axiosAuthApi} from "../../../middleware/axiosApi.ts";
import {SectionCard} from "../../../theme/styled-components/SectionCard.ts";
import ServiceSelectionCard from "./ServiceSelectionCard.tsx";
import {Selection} from "./ServiceSelectionCard.tsx";

interface Props {
  service: ServiceProps
}

type ServiceDetails = { type: string } & (Selection)

const renderTypeDetails = (details: ServiceDetails) => {
  switch (details.type) {
    case 'SELECTION':
      return <ServiceSelectionCard type={details.type} details={details as Selection} />;
    default:
      return <SectionCard> <p>Nieobsługiwany typ usługi: {details.type}</p> </SectionCard>;
  }
}

function ServiceAttributeDetails({service}: Props) {
  const [serviceDetails, setServiceDetails] = useState<ServiceDetails | null>(null);
  const [sectionLoading, setSectionLoading] = useState(true);

  useEffect(() => {
    setSectionLoading(true);
    axiosAuthApi.get(`/services/${service.id}/attributes`)
      .then(res => {
        console.log(res.data);
        setServiceDetails(res.data);
      })
      .catch(error => console.log(error))
      .finally(() => setSectionLoading(false));
  }, [service.id]);

  if (sectionLoading) {
    return <SectionCard> <p>Loading...</p> </SectionCard>;
  }

  if (serviceDetails === null) {
    return <SectionCard> <p>Błąd pobierania danych</p> </SectionCard>;
  }

  return renderTypeDetails(serviceDetails);
}

export default ServiceAttributeDetails;
