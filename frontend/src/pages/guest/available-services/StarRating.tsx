import {Rating as RatingType} from "../../../types";
import Rating from "@mui/material/Rating";

const StarRating = ({ rating }: {rating: RatingType[]}) => {

  const calcRating = () => {
    if (rating.length === 0) return 0;
    if (rating.length === 1) return rating[0].rating;
    const total = rating.reduce((sum, num) => sum + num.rating, 0);
    return total / rating.length;
  }

  return <Rating readOnly value={calcRating()} precision={0.5} sx={{fontSize: '150%'}} />
};

export default StarRating;
