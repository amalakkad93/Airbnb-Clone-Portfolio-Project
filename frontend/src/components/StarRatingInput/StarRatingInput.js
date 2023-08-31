import React, { useState, useEffect } from 'react';
import './StarRatingInput.css'

export default function StarRatingInput({ rating, onChange }) {
  const [hoverRating, setHoverRating] = useState(0);
  const [activeRating, setActiveRating] = useState(rating);

  useEffect(() => {
    setActiveRating(rating);
  }, [rating]);

  const handleMouseEnter = (number) => {
    setHoverRating(number);
  };

  const handleMouseLeave = () => {
    setHoverRating(0);
  };

  const handleClick = (number) => {
    setActiveRating(number);
    onChange(number);
  };

  const starsIcon = (number) => {
    let className = "";
    if (hoverRating >= number) {
      className = "filled";
    } else if (activeRating >= number) {
      className = "filled";
    } else {
      className = "empty";
    }

    return (
      <div
        key={number}
        className={className}
        onMouseEnter={() => handleMouseEnter(number)}
        onMouseLeave={handleMouseLeave}
        onClick={() => handleClick(number)}
      >
        <i className="fa fa-star" ></i>
      </div>
    );
  };

  return (
    <div className="rating-input">
      { [1, 2, 3, 4, 5].map(number => starsIcon(number)) }
    </div>
  );
}


// import { useEffect, useState } from 'react';

// export default function StarRatingInput({ rating, disabled, onChange }) {
//   const [activeRating, setActiveRating] = useState(rating);

//   useEffect(() => {
//     setActiveRating(rating);
//   }, [rating]);
//   // NOTE: This useEffect isn't necessary to have for this scenario, but if you
//   // have a scenario which requires this input to be re-rendered with an updated
//   // rating prop instead of unmounted and remounted with an updated rating, then
//   // this useEffect is necessary.

//   const starsIcon = (number) => {
//     const props = {};
//     if (!disabled) {
//       props.onMouseEnter = () => setActiveRating(number);
//       props.onMouseLeave = () => setActiveRating(rating);
//       props.onClick = () => onChange(number);
//     }
//     return (
//       <div key={number} className={activeRating >= number ? "filled" : "empty"} {...props}>
//         <i className="fa-light fa-star" style={{ color: "#000000" }}></i>
//       </div>
//     );
//   };

//   return (
//     <div className="rating-input">
//       {[1, 2, 3, 4, 5].map(number => starsIcon(number))}
//     </div>
//   );
// };



// import React from "react";
// import StarRatings from "react-star-ratings";

// const StarRating = ({ rating, changeRating }) => {
//   return (
//     <StarRatings
//       rating={rating}
//       starRatedColor="#ff6d75"
//       starEmptyColor="#aaa"
//       starHoverColor="#ff6d75"
//       changeRating={changeRating}
//       numberOfStars={5}
//       name="rating"
//     />
//   );
// };
