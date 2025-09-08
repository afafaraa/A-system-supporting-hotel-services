import Title from "../../components/ui/Title.tsx";
import {SectionCard} from "../../theme/styled-components/SectionCard.ts";
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined';

function ReviewsPage() {

  return (
    <SectionCard>
      <Title title={<><StarBorderOutlinedIcon /> Service Reviews & Performance</>}
             subtitle={"Guest feedback for services you've provided (0 reviews)"} />
      <SectionCard sx={{bgcolor: "background.default", borderWidth: 0, borderRadius: 2}}>
        to be implemented...
      </SectionCard>
    </SectionCard>
  );
}

export default ReviewsPage;
