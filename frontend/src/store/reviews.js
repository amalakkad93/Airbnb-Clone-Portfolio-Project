// import {useDispatch} from 'react-redux';
import { csrfFetch } from "./csrf";

// ************************************************
//                   ****types****
// ************************************************
const GET_ALL_REVIEWS = "/get_all_reviews"; //read. // GET spots/
const CREATE_REVIEW = "CREATE_REVIEW";

// ************************************************
//                   ****action creator****
// ************************************************
const actionGetReviews = (reviews) => ({ type: GET_ALL_REVIEWS, reviews });
const actionCreateReview = (review) =>({ type: CREATE_REVIEW, review});

// ************************************************
//                   ****Thunks****
// ************************************************

// ***************************getAllReviewsThunk**************************
// these functions hit routes
export const getAllReviewsThunk = (spotId) => async (dispatch) => {

  try {
    // const res = await csrfFetch(`/api/spots/${spotId}/reviews`);
    const res = await fetch(`/api/spots/${spotId}/reviews`);

    if (res.ok) {
      const { Reviews } = await res.json();
      console.log('Fetched all reviews successfully. Reviews:', Reviews);
      // dispatch(getAllReviews(normalizeArr(Reviews)));
      dispatch(actionGetReviews(Reviews));
      // dispatch(getAllSpots(Spots));
      return Reviews;
    } else {
      const errors = await res.json();
      // console.log('Error fetching reviews:', errors);
      return errors;
    }
  } catch (error) {
    console.error('Error fetching reviews:', error);
  }
};

// ***************************createReviewThunk***************************
export const createReviewThunk = (spotId, review, stars) => async (dispatch) => {
  try {

    // console.log("*******Creating review...", spotId, review, stars);
    const res = await csrfFetch(`/api/spots/${spotId}/reviews`, {
      method: "POST",
      body: JSON.stringify({ review, stars }),
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (res.ok) {
      const data = await res.json();
      // console.log("*******Review created:", data.review);
      dispatch(actionCreateReview(data.review));
    } else {
      // console.error("*******Error response:", res);
      throw res;
    }
  } catch (error) {
    // console.error("*******Error creating review:", error);
    throw error;
  }
};
// ***************************getAllReviewsOfCurrentUser***************************
// ***************************deleteReviewThunk**************************
// ***************************getReviewBySoptIdThunk**************************
// ***************************getSingleReviewThunk**************************
// ***************************updateReviewThunk**************************

// ***************************normalizeArr**************************
function normalizeArr(reviews) {
  const normalizedReviews = {};
  reviews.forEach((review) => (normalizedReviews[review.id] = review));
  return normalizedReviews;
}
//******************************************************************** */
const getUserReviewsById = (payload) => {
  return payload.reduce((acc, review) => {
    acc[review.id] = {
      userId: review.userId,
      spotId: review.spotId,
      reviewText: review.review,
      stars: review.stars,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
      user: review.User,
      reviewImages: review.ReviewImages,
    };
    return acc;
  }, {});
};
//************************************************************************ */
const filterAndModifyReviews = (reviewsObj, reviewsId, reviewIds) => {
  const newReviewsId = reviewsId.toString();
  const updatedReviewIds = reviewIds.filter((id) => id !== newReviewsId);

  return updatedReviewIds.reduce((newObject, id) => {
    const nestedUser = reviewsObj[id].User;
    const nestedReviewImages = reviewsObj[id].ReviewImages;
    newObject[id] = {
      ...reviewsObj[id],
      User: { ...nestedUser },
      ReviewImages: [...nestedReviewImages],
    };
    return newObject;
  }, {});
};
// ************************************************
//                   ****Reducer****
// ************************************************
// const initialState = { allSpots: {}, singleSpot: {}, reviews: { spot: null, user: {} }, isLoading: true };
const initialState = { allSpots: {}, singleSpot: {}, reviews: { spot: {}, user: {} } };

export default function reviewReducer(state = initialState, action) {
  let newState;
  switch (action.type) {
    case GET_ALL_REVIEWS:
      console.log('State before:', state);
      newState = { ...state, reviews: { spot: {}, user: {} } };
      newState.reviews.spot = action.reviews;
      console.log('State after:', newState);
      return newState;

    // case CREATE_REVIEW:
    //   console.log('State Review before:', state);
    //   newState = { ...state, reviews: { spot: {}, user: {} } };
    //   newState.reviews.spot = action.review;
    //   console.log('State Review before:', state);
    //   return newState;
    // case GET_ALL_REVIEWS:
    //   return { ...state, reviews: { ...state.reviews, spot: { ...state.reviews.spot, ...action.reviews } } };

    case 'CREATE_REVIEW':
      return { ...state, reviews: { ...state.reviews, spot: { ...state.reviews.spot, [action.review.id]: action.review } } };



    default:
      return state;
  }
}
