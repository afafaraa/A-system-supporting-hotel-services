import Title from "../../components/ui/Title.tsx";
import {SectionCard} from "../../theme/styled-components/SectionCard.ts";
import HotelIcon from '@mui/icons-material/Hotel';
import {useTranslation} from "react-i18next";


function ReservationsPage() {
  const {t} = useTranslation();
  const tc = (key: string) => t(`pages.employee.reservations.${key}`);

  return (
    <SectionCard>
      <Title title={<><HotelIcon /> {tc("title")}</>}
             subtitle={tc("subtitle")} />
    </SectionCard>
  );
}

export default ReservationsPage;
