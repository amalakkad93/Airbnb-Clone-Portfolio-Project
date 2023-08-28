// import {useDispatch} from 'react-redux';
import { csrfFetch } from "./csrf";

// ************************************************
//                   ****types****
// ************************************************
const GET_ALL_REVIEWS = "/get_all_reviews"; //read. // GET spots/

// ************************************************
//                   ****action creator****
// ************************************************
export const actionGetReviews = (reviews) => ({ type: GET_ALL_REVIEWS, reviews });

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

      // newState = { ...state, spot: {} };
      // newState.spot = action.reviews;

      // newState = { ...state, reviews: { ...state.reviews, spot: action.reviews } };
      // newState.reviews.spot = action.reviews;
      // return newState;

      console.log('State before:', state);
      newState = { ...state, reviews: { spot: {}, user: {} } };
      newState.reviews.spot = action.reviews;
      console.log('State after:', newState);
      return newState;
    default:
      return state;
  }
}
