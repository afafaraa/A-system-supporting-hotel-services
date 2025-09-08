import Title from "../../components/ui/Title.tsx";
import {SectionCard} from "../../theme/styled-components/SectionCard.ts";
import HotelIcon from '@mui/icons-material/Hotel';

function ReservationsPage() {

  return (
    <SectionCard>
      <Title title={<><HotelIcon /> Pending room reservations</>}
             subtitle={"Room reservations requiring approval"} />
    </SectionCard>
  );
}

export default ReservationsPage;
