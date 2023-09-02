// import {useDispatch} from 'react-redux';
import { csrfFetch } from "./csrf";

// ************************************************
//                   ****types****
// ************************************************
const GET_ALL_REVIEWS = "/get_all_reviews"; //read. // GET spots/
const CREATE_REVIEW = "CREATE_REVIEW";
const DELETE_REVIEW = "DELETE_REVIEW";

// ************************************************
//                   ****action creator****
// ************************************************
const actionGetReviews = (reviews) => ({ type: GET_ALL_REVIEWS, reviews });
const actionCreateReview = (review) => ({ type: CREATE_REVIEW, review });
const actionDeleteReview = (reviewId) => ({ type: DELETE_REVIEW, reviewId });

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
      // const Reviews  = await res.json();
      // console.log('Fetched all reviews successfully. Reviews:', Reviews);
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
    console.error("Error fetching reviews:", error);
  }
};

// ***************************createReviewThunk***************************
export const createReviewThunk =
  (spotId, review, stars) => async (dispatch) => {
    try {
      // console.log("*******Creating review...", spotId, review, stars);
      const res = await csrfFetch(`/api/spots/${spotId}/reviews`, {
        method: "POST",
        body: JSON.stringify({ review, stars }),
        headers: {
          "Content-Type": "application/json",
        },
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
// ***************************deleteReviewThunk**************************
export const deleteReviewThunk = (reviewId) => async (dispatch) => {
  try {
    // console.log('Deleting review with id:', reviewsId);
    const res = await csrfFetch(`/api/reviews/${reviewId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      dispatch(actionDeleteReview(reviewId));
    } else {
      const errors = await res.json();
      // console.log('Error deleting review:', errors);
      // console.error('Error fetching data:', errors);
      return errors;
    }
  } catch (error) {
    // console.error('Error deleting review:', error);
  }
};

// ************************************************
//                   ****Reducer****
// ************************************************
// const initialState = { allSpots: {}, singleSpot: {}, reviews: { spot: null, user: {} }, isLoading: true };
const initialState = {
  allSpots: {},
  singleSpot: {},
  reviews: { spot: {}, user: {} },
  isLoading: true,
};

export default function reviewReducer(state = initialState, action) {
  let newState;
  switch (action.type) {
    case GET_ALL_REVIEWS:
      newState = { ...state, reviews: { spot: {}, user: {} } };
      newState.reviews.spot = action.reviews;
      return newState;

    case CREATE_REVIEW:
      newState = {
        ...state,
        reviews: { ...state.reviews, spot: { ...state.reviews.spot } },
      };
      newState.reviews.spot[action.review.id] = action.review;
      return newState;

    case DELETE_REVIEW:
      // newState = {...state.reviews.spot}
      // return newState[action.reviewId];
      newState = {
        ...state,
        reviews: {
          ...state.reviews,
          spot: { ...state.reviews.spot },
          user: { ...state.reviews.user },
        },
      };
      delete newState.reviews.spot[action.reviewId];
      return newState;

    default:
      return state;
  }
}
// ***************************getAllReviewsOfCurrentUser***************************
// ***************************getReviewBySoptIdThunk**************************
// ***************************getSingleReviewThunk**************************
// ***************************updateReviewThunk**************************
