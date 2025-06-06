import React from 'react';

type StarRatingProps = {
  rating: number[]; // e.g., 3.5
  outOf?: number; // default 5
};

const StarRating: React.FC<StarRatingProps> = ({ rating, outOf = 5 }) => {
  const stars = [];

  const calcRating = () => {
    if (rating.length === 0) return 0;
    const total = rating.reduce((sum, num) => sum + num, 0);
    return total / rating.length;
  }

  const ratingAvg = calcRating();
  for (let i = 1; i <= outOf; i++) {
    if (i <= ratingAvg) {
      stars.push(<span key={i}>★</span>);
    } else if (i - ratingAvg < 1) {
      stars.push(<span key={i}>⯪</span>);
    } else {
      stars.push(<span key={i}>☆</span>);
    }
  }

  return <div style={{ color: 'gold', fontSize: '24px' }}>{stars}</div>;
};

export default StarRating;
