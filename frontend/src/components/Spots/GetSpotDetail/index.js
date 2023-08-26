import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getSpotDetailThunk } from "../../../store/spots";
import { getAllReviewsThunk } from "../../../store/reviews";
import OpenModalButton from "../../OpenModalButton";
// import CreateReviewModal from "../../Reviews/ReviewModals/CreateReviewModal";

import "./GetSpotDetail.css";

export default function SpotDetail() {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  // const [rating, setRating] = useState(3.5);
  const [reloadPage, setReloadPage] = useState(false);

  const spot = useSelector((state) => state.spots.singleSpot ? state.spots.singleSpot : null);
  const reviews = useSelector((state) => state.reviews.spot ? state.reviews.spot : null);

  const avgRating = spot.avgStarRating ? spot.avgStarRating.toFixed(1) : "New";
  const numberOfReviews = spot.numReviews > 0 ? spot.numReviews : "";

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleString("en-US", options);
  };

console.log("***************************",spot)

  useEffect(() => {
    dispatch(getSpotDetailThunk(spotId));
    dispatch(getAllReviewsThunk(spotId));

  }, [dispatch, spotId, reloadPage]);

if (!spot || !spot.id) return null;

  return (
    <>
    <div className="tile-parent">
       {/* *********************Name and Location Container**************************** */}
       <div className="name-Location-container">
            <h2>{spot.name}</h2>
            <span className="location">{`${spot.city}, ${spot.state}, ${spot.country}`}</span>
       </div>
       {/* *********************Spot Images Container**************************** */}
       <div className="spot-images-container">
            {/* =================Left Spot Image================= */}
            <div className="left-spot-image-container">
                 {/* <img className="resize" src={spot.SpotImages[0]?.url} alt={spot.name}/> */}
                 {/* <img className="resize top-left-rounded" src={spot.SpotImages[0]?.url} alt={spot.name} /> */}
                 <img className="resize left-rounded" src={spot.SpotImages[0]?.url} alt={spot.name} />
            </div>
            {/* ================Right Spot Images================ */}
            <div className="right-spot-image-container">
                 {spot.SpotImages?.slice(1, 5).map((image, index, array) => (
                       <div className={`right-image ${index === 1 ? "top-right-rounded" : ""} ${index === array.length - 1 ? "bottom-right-rounded" : ""}`} key={index}>
                         <img className="resize" src={image.url} alt={`Image ${index + 1}`}/>
                       </div>
                 ))}
            </div>
       </div>
       {/* *********************************************************************** */}
       {/* *********************Details Container**************************** */}
       <div className="details-container">
            {/* =========Ownner Details and Description========== */}
            <div className="ownner-details-and-description-container">
                 {/* ++++++++++++++++++Ownner Details+++++++++++++++++++++ */}
                 <h2 className="ownner-details"> Hosted by, {spot.User && spot.User.firstName}{" "} {spot.User && spot.User.lastName}</h2>
                 {/* ++++++++++++++++++Description+++++++++++++++++++++ */}
                 <p>{spot.description}</p>
            </div>
            {/* =========Price, Rating, Number Of Reviews, and Reserve Btn Container========== */}
            <div className="callout-information-box">
                 {/* ++++++++++++++++++Price, Rating, Number Of Reviews+++++++++++++++++++++ */}
                 <div className="price-rating-numberOfReviews-container">
                      {/* -------------price-p-tag------------- */}
                      <p className="price-p-tag">
                         <span className="spot-price">${spot.price}</span> night
                      </p>
                      {/* ---avgRating-numberOfReviews-p-tag--- */}
                      <p className="avgRating-numberOfReviews-p-tag">
                         {`★ ${avgRating}${numberOfReviews !== "" ? ` · ${numberOfReviews} reviews` : ""}`}
                      </p>
                 </div>
                 {/* ++++++++++++++++++++++++++Reserve Btn+++++++++++++++++++++++++++++++++ */}
                 <button  className="reserve-btn" type="button" onClick={() => alert("Feature Coming Soon...")}>Reserve</button>
            </div>
       </div>
       {/* *********************************************************************** */}

       {/* *********************Reviews Container**************************** */}

        <div className="reviews-container">
             <div className="review-and-post-Review-button">
             {/* =========Post Review Button========== */}
                  <h2>{`★ ${avgRating}${numberOfReviews !== "" ? ` · ${numberOfReviews} reviews` : ""}`}</h2>
                  <OpenModalButton className="post-review-btn" buttonText="Post Your Review" modalComponent={<button  />} />
             </div>
             {/* =========Post Review Button========== */}

             {reviews && reviews.length >= 1 ?
                (
                    reviews.map((review, index) => (
                        <div className="review-item" key={index}>
                            <h3>{review.User.firstName} {review.User.lastName}</h3>
                            <p className="date-format">{formatDate(review.createdAt)}</p>
                            <p>{review.review}</p>
                        </div>
                    ))
                ):(
                    <p>Be the frst to post a review!</p>
                )
             }
        </div>
       {/* *********************************************************************** */}
    </div>
    </>
  );
}
