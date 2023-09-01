import React from "react";
import { useSelector } from "react-redux";
import DeleteReviewModal from "./DeleteReviewModal"
import OpenModalButton from "../../OpenModalButton"

export default function GetAllReviewsModal({ spot, setReloadPage }) {
  const reviews = useSelector((state) => state.reviews.reviews.spot ? state.reviews.reviews.spot : null);
  const sessionUser = useSelector((state) => state.session.user);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleString("en-US", options);
  };

  return (
    <div className="reviews-container">
      {reviews && reviews.length > 0 ? (
        reviews.map((review, index) => (
          <div className="review-item" key={index}>
            {review.userId === sessionUser.id ? (
              <>
                <h3>{review.User.firstName}</h3>
                <p className="date-format">{formatDate(review.createdAt)}</p>
                <p className="p-tag-same-font">{review.review}</p>
                <OpenModalButton buttonText="Delete" modalComponent={<DeleteReviewModal reviewId={review.id} spotId={spot.id} setReloadPage={setReloadPage}/>}/>
              </>
              ) : (
              <>
                <h3>{review.User.firstName}</h3>
                <p className="date-format">{formatDate(review.createdAt)}</p>
                <p className="p-tag-same-font">{review.review}</p>
              </>
              )
            }
          </div>
        ))
      ) : (
        <p>Be the first to post a review!</p>
      )}
    </div>
  );
}
