import { useMediaQuery } from "@mui/material";
import {Rating as RatingType} from "./AvailableServiceCard.tsx";
import Rating from "@mui/material/Rating";

const StarRating = ({ rating }: {rating: RatingType[]}) => {
  const isXs = useMediaQuery(theme => theme.breakpoints.only("xs"));

  const calcRating = () => {
    if (rating.length === 0) return 0;
    const total = rating.reduce((sum, num) => sum + num.rating, 0);
    return total / rating.length;
  }

  return <Rating readOnly defaultValue={calcRating()} precision={0.5} size={isXs ? "large" : "medium"} />
};

export default StarRating;
