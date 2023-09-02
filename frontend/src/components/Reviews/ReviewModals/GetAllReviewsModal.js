import React from "react";
import { useSelector } from "react-redux";
import DeleteReviewModal from "./DeleteReviewModal"
import OpenModalButton from "../../OpenModalButton"
import './GetAllReviewsModal.css'

export default function GetAllReviewsModal({ spot, setReloadPage }) {
  const reviews = useSelector((state) => state.reviews.reviews.spot ? state.reviews.reviews.spot : null);
  const sessionUser = useSelector((state) => state.session.user);
  const sortedReviews = Array.isArray(reviews) ? [...reviews].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) : [];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleString("en-US", options);
  };

  if(!sortedReviews) return null;
  return (
    <div className="reviews-container">
      {sortedReviews && sortedReviews.length > 0 ? (
        sortedReviews.map((review, index) => (
          <div className="review-item" key={index}>
            <h3>{review.User.firstName}</h3>
            <p className="date-format">{formatDate(review.createdAt)}</p>
            <p className="p-tag-same-font">{review.review}</p>
            {review.userId === (sessionUser ? sessionUser.id : null) &&
              <OpenModalButton
                 className="post-delete-review-btn"
                 buttonText="Delete"
                 modalComponent={<DeleteReviewModal reviewId={review.id} spotId={spot.id} setReloadPage={setReloadPage}/>}
              />
            }
          </div>

        ))
      ) : (
        <p>Be the first to post a review!</p>
      )}
    </div>
  );
}
