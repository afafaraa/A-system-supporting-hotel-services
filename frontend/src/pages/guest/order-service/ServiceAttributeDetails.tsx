import {ServiceProps} from "../available-services/AvailableServiceCard.tsx";
import {Dispatch, SetStateAction, useEffect, useState} from "react";
import {axiosAuthApi} from "../../../middleware/axiosApi.ts";
import {SectionCard} from "../../../theme/styled-components/SectionCard.ts";
import ServiceSelectionCard from "./ServiceSelectionCard.tsx";
import {ServiceDetails, SelectionAttributes} from "../../../types/service_type_attributes.ts"
import {useTranslation} from "react-i18next";


interface Props {
  service: ServiceProps;
  setServiceAttributes: Dispatch<SetStateAction<{desc: string | null; price: number | null;}>>;
}

function ServiceAttributeDetails({service, setServiceAttributes}: Props) {
  const [serviceDetails, setServiceDetails] = useState<ServiceDetails | '' | null>(null);
  const [sectionLoading, setSectionLoading] = useState(true);
  const {t} = useTranslation();

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

  if (sectionLoading) return <SectionCard> <p>Loading...</p> </SectionCard>;
  if (serviceDetails === '') return null
  if (serviceDetails === null) return <SectionCard> <p>Błąd pobierania danych</p> </SectionCard>;

  switch (serviceDetails.type) {
    case 'SELECTION':
      return <ServiceSelectionCard details={serviceDetails as SelectionAttributes} setServiceAttributes={setServiceAttributes} />;
    default:
      return <SectionCard> <p>{t('pages.order_service.unsupportedAttributeType')}: {serviceDetails.type}</p> </SectionCard>;
  }
}

export default ServiceAttributeDetails;
