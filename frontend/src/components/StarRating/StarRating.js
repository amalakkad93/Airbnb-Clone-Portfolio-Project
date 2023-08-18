import React from "react";
import StarRatings from "react-star-ratings";

const StarRating = ({ rating, changeRating }) => {
  return (
    <StarRatings
      rating={rating}
      starRatedColor="#ff6d75"
      starEmptyColor="#aaa"
      starHoverColor="#ff6d75"
      changeRating={changeRating}
      numberOfStars={5}
      name="rating"
    />
  );
};

export default StarRating;
