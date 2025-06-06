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

  for (let i = 1; i <= outOf; i++) {
    const ratingAvg = calcRating();
    if (i <= ratingAvg) {
      stars.push(<span key={i}>★</span>); // filled star
    } else if (i - ratingAvg < 1) {
      stars.push(<span key={i}>☆</span>); // could replace with half star if needed
    } else {
      stars.push(<span key={i}>☆</span>); // empty star
    }
  }

  return <div style={{ color: 'gold', fontSize: '24px' }}>{stars}</div>;
};

export default StarRating;
