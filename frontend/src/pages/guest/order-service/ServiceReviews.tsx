import {SectionCard} from "../../../theme/styled-components/SectionCard.ts";
import SectionTitle from "../../../components/ui/SectionTitle.tsx";
import ReviewsOutlinedIcon from '@mui/icons-material/ReviewsOutlined';
import {Rating} from "../../../types";
import MUIRating from "@mui/material/Rating";
import Box from "@mui/system/Box";
import useTranslationWithPrefix from "../../../locales/useTranslationWithPrefix.tsx";

interface Props {
  ratings: Rating[];
}
function ServiceReviews({ ratings }: Props) {
  const {t: tc} = useTranslationWithPrefix("pages.order_service");

  return (
    <SectionCard>
      <SectionTitle title={<><ReviewsOutlinedIcon /> {tc("serviceReviews")}</>}
                    subtitle={tc("serviceReviewsSubtitle")}
      />
      {ratings.length === 0 ? (
        <p>{tc("noReviews")}</p>
      ) : (
        ratings.map((rating, index) => (
          <SectionCard size={2} key={index} mt={2}>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <strong>{rating.fullName}</strong>
              <MUIRating readOnly value={rating.rating} precision={0.5} sx={{fontSize: '160%'}} />
            </Box>
            <p>"{rating.comment}"</p>
          </SectionCard>
        ))
      )}
    </SectionCard>
  );
}

export default ServiceReviews;
