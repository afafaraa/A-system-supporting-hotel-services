import {ServiceProps} from "../pages/guest/available-services/AvailableServiceCard.tsx";
import {t} from "i18next";

const formatServicePrice = (service: Pick<ServiceProps, "price" | "minPrice">) =>
  `${service.price >= 0.01 ? 
    service.price.toFixed(2) 
    : 
    service.minPrice ? 
      `${t('common.priceFrom')} ${service.minPrice.toFixed(2)}` 
      : 
      '— '
  }$`;

export default formatServicePrice;
