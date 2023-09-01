import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getSpotDetailThunk } from "../../../store/spots";
import { getAllReviewsThunk } from "../../../store/reviews";
import GetAllReviewsModal from "../../Reviews/ReviewModals/GetAllReviewsModal"
import OpenModalButton from "../../OpenModalButton";
import CreateReviewModal from "../../Reviews/ReviewModals/CreateReviewModal";

import "./GetSpotDetail.css";

export default function SpotDetail() {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const [reloadPage, setReloadPage] = useState(false);
  const [loading, setLoading] = useState(true);

  const spot = useSelector((state) => state.spots.singleSpot ? state.spots.singleSpot : null);
  const sessionUser = useSelector((state) => state.session.user);
  const reviews = useSelector((state) => state.reviews.reviews.spot ? state.reviews.reviews.spot : null);
  const userSpotReview = (sessionUser) ? Object.values(reviews).find((currentReview) => currentReview.userId === sessionUser.id) : {};
  // const userSpotReview = Object.values(reviews).find((currentReview) => currentReview && currentReview.User && currentReview.User.id === sessionUser.id);



  useEffect(() => {
    dispatch(getSpotDetailThunk(spotId));
    dispatch(getAllReviewsThunk(spotId)).finally(() => setLoading(false));
  }, [dispatch, spotId, reloadPage]);

  if (!spot || !spot.id) return null;

  return (
    <>
      <div className="tile-parent">
        <div className="name-Location-container">
          <h1>{spot.name}</h1>
          <span className="location">{`${spot.city}, ${spot.state}, ${spot.country}`}</span>
        </div>

        <div className="spot-images-container">
          <div className="left-spot-image-container">
            <img
              className="resize left-rounded"
              src={spot.SpotImages[0]?.url}
              alt={spot.name}
            />
          </div>

          <div className="right-spot-image-container">
            {spot.SpotImages?.slice(1, 5).map((image, index, array) => (
              <div
                className={`right-image ${
                  index === 1 ? "top-right-rounded" : ""
                } ${index === array.length - 1 ? "bottom-right-rounded" : ""}`}
                key={index}
              >
                <img
                  className="resize"
                  src={image.url}
                  alt={`Image ${index + 1}`}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="details-container">
          <div className="ownner-details-and-description-container">
            <h2 className="ownner-details">
              {" "}
              Hosted by, {spot.User && spot.User.firstName}{" "}
              {spot.User && spot.User.lastName}
            </h2>
            <p className="p-tag-same-font">{spot.description}</p>
          </div>

          <div className="callout-information-box">
            <div className="price-rating-numberOfReviews-container">
              <p className="price-p-tag">
                <span className="spot-price">${spot.price}</span> night
              </p>
              <p className="avgRating-numberOfReviews-p-tag">
                <span className="avgRating-numberOfReviews-span">
                  {/* ★ {spot.avgStarRating ? spot.avgStarRating.toFixed(1) : <span className="boldText">New</span>} */}
                  ★ {(spot.avgStarRating !== null && spot.avgStarRating !== undefined) ? spot.avgStarRating.toFixed(1) : <span className="boldText">New</span>}

                  {spot.numReviews > 0 && (
                    <>
                      {" "}
                      · {spot.numReviews}
                      <span className="grey-text">
                        {spot.numReviews === 1 ? " review" : " reviews"}
                      </span>
                    </>
                  )}
                </span>
              </p>
            </div>

            <button
              className="reserve-btn"
              type="button"
              onClick={() => alert("Feature Coming Soon...")}
            >
              Reserve
            </button>
          </div>
        </div>
        <div className="review-and-post-Review-button">
        <h2 className="avgRating-numofReviews">
          {/* ★ {spot.avgStarRating.toFixed(1)} */}
          {/* ★ {(spot.avgStarRating !== null && spot.avgStarRating !== undefined) ? spot.avgStarRating.toFixed(1) : ""} */}

          ★ {(spot.avgStarRating !== null && spot.avgStarRating !== undefined) ? spot.avgStarRating.toFixed(1) : <span className="boldText">New</span>}
          {/* {spot?.numReviews > 0 && ` · ${spot.numReviews} ${spot.numReviews === 1 ? 'review' : 'reviews'}`} */}
          {spot.numReviews > 0 && ` · ${spot.numReviews} ${spot.numReviews === 1 ? 'review' : 'reviews'}`}

        </h2>

        {!userSpotReview && (spot.User.id !== sessionUser.id) &&
          <OpenModalButton
            className="post-review-btn"
            buttonText="Post Your Review"
            modalComponent={
              <CreateReviewModal
                spotId={spot.id}
                setReloadPage={setReloadPage}
              />
            }
          />
        }
      </div>

      <GetAllReviewsModal spot={spot} setReloadPage={setReloadPage} />
      </div>
    </>
  );
}
