import React from 'react';
import {Rating} from "./AvailableServiceCard.tsx";
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import StarIcon from '@mui/icons-material/Star';

type StarRatingProps = {
  rating: Rating[];
  outOf?: number;
};

const StarRating: React.FC<StarRatingProps> = ({ rating, outOf = 5 }) => {
  const stars = [];

  const calcRating = () => {
    if (rating.length === 0) return 0;
    const total = rating.reduce((sum, num) => sum + num.rating, 0);
    return total / rating.length;
  }

  const ratingAvg = calcRating();
  for (let i = 1; i <= outOf; i++) {
    if (i <= ratingAvg) {
      stars.push(<span key={i}><StarIcon /></span>);
    } else if (i - ratingAvg < 1) {
      stars.push(<span key={i}><StarHalfIcon /></span>);
    } else {
      stars.push(<span key={i}><StarOutlineIcon /></span>);
    }
  }

  return <div style={{ color: 'gold', fontSize: '24px' }}>{stars}</div>;
};

export default StarRating;
