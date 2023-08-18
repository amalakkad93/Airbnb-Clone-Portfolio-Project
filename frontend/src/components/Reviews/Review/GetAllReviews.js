import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { getAllReviewsThunk, createReview } from "../../../store/reviews";
// import ReviewItem from "./ReviewItem";
import './Reviews.css';
import OpenModalButton from "../../OpenModalButton";
import CreateReviewModal from "../ReviewModals/CreateReviewModal";
import DeleteReviewModal from "../ReviewModals/DeleteReviewModal";
// import StarsRatingInput from "./StarsRatingInput";
import {createReviewThunk } from '../../../store/reviews';

const GetAllReviews = ({ spotId }) => {
  const spot = useSelector((state) => state.spots.singleSpot);
  const reviews = useSelector((state) => state.reviews.spot);
  const avgRating = spot.avgStarRating ? spot.avgStarRating.toFixed(1) : "N/A";
  const numberOfReviews = spot.numReviews;

  const currentUser = useSelector((state) => state.session.user);
  const dispatch = useDispatch();
  const [reloadPage, setReloadPage] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleString("en-US", options);
  };

  useEffect(() => {
    const fetchData = async () => {

      await getAllReviewsThunk(dispatch, spotId)
    };


    fetchData();
  }, [dispatch, spotId, reloadPage]);


  console.log("***************************spotId****************", spot.id);

  return (
    <ul>
      <div className="reviews-container">
        <div className="review-and-post-Review-button">
          <h2>{`⭐ ${avgRating} · ${numberOfReviews} reviews`}</h2>
          <OpenModalButton buttonText="Post Your Review" modalComponent={<CreateReviewModal spotId={spot.id } setReloadPage={setReloadPage} />} />
        </div>
        {reviews.length >= 1 &&
          reviews.map((review, index) => (
            <div className="review-item" key={index}>
              <h3>
                {review.User.firstName} {review.User.lastName}
              </h3>
              <p style={{ fontSize: "1.1rem", color: "grey" }}>
                {formatDate(review.createdAt)}
              </p>
              <p>{review.review}</p>
            </div>
          ))}
      </div>
    </ul>
  );
};

export default GetAllReviews;
