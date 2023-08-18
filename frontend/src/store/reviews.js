// import {useDispatch} from 'react-redux';
import { csrfFetch } from "./csrf";

// ************************************************
//                   ****types****
// ************************************************
const GET_ALL_REVIEWS = "/get_all_reviews"; //read. // GET spots/
const GET_REVIEW_BY_SOPT_ID = "/GET_REVIEW_BY_SOPT_ID"; //SPOT_DETAIL // "spots/getSpotDetail"
const GET_SINGLE_REVIEW = "/get_single_review"; //SPOT_DETAIL // "spots/getSpotDetail"
const UPDATE_SINGLE_REVIEW = "UPDATE_SINGLE_review";
const DELETE_REVIEW = "DELETE_REVIEW";
const CREATE_REVIEW = "CREATE_REVIEW";
const GET_USER_REVIEWS = "GET_USER_REVIEWS";

// ************************************************
//                   ****action creator****
// ************************************************
export const getReviews = (reviews) => ({ type: GET_ALL_REVIEWS, reviews });
export const createReview = (review) =>({ type: CREATE_REVIEW, review});

export const getReviewBySoptId = (review) => ({ type: GET_REVIEW_BY_SOPT_ID, review });
export const getReviewsByCurrentUser = (reviews) => ({ type: GET_USER_REVIEWS, reviews });

export const getSingleReview = (review) => ({ type: GET_SINGLE_REVIEW, review });
export const updateReview = (review) => ({ type: UPDATE_SINGLE_REVIEW, review});
export const  deleteReview = (reviewId) => ({ type: DELETE_REVIEW, reviewId });

//********************************************************************************************************************************************************************* */
export const getAllReviews = state => state?.reviews ? Object.values(state.reviews) : [];
export const getReviewsForSpot = SpotId => state => state?.reviews ? Object.values(state.reviews).filter(review => review.spotId === SpotId) : [];
export const getReview = reviewId => state => state?.reviews ? state.reviews[reviewId] : null;
//********************************* *************************************************************************************************************************************/

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
      // console.log('Fetched all reviews successfully. Reviews:', Reviews);
      // dispatch(getAllReviews(normalizeArr(Reviews)));
      dispatch(getReviews(Reviews));
      // dispatch(getAllSpots(Spots));
      return Reviews;
    } else {
      const errors = await res.json();
      // console.log('Error fetching reviews:', errors);
      return errors;
    }
  } catch (error) {
    // console.error('Error fetching reviews:', error);
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
      dispatch(createReview(data.review));
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
export const getAllReviewsOfCurrentUser = (spotId) => async (dispatch) => {
  try {
    console.log("Fetching reviews for current user...");
    const res = await csrfFetch(`/api/reviews/current`);

    if (res.ok) {
      const { Reviews } = await res.json();
      // console.log("***********************In res.ok getAllReviewsOfCurrentUser");
      // console.log("Received reviews data:", Reviews);
      return dispatch(getReviewsByCurrentUser(Reviews)); // Dispatch the action using dispatch function
    } else {
      const errors = await res.json();
      // console.log("Error fetching reviews:", errors);
      return errors;
    }
  } catch (error) {
    // console.error('Error fetching data:', error);
    return error;
  }
};

// ***************************deleteReviewThunk**************************
export const deleteReviewThunk = (reviewsId) => async (dispatch) => {
  try {
    // console.log('Deleting review with id:', reviewsId);
    const res = await csrfFetch(`/api/reviews/${reviewsId}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      dispatch(deleteReview(reviewsId));
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

// ***************************getReviewBySoptIdThunk**************************
// these functions hit routes
export const getReviewBySoptIdThunk = (spotId) => async (dispatch) => {
  try {
    const res = await fetch(`/api/spots/${spotId}/reviews`);

    if (res.ok) {
      const { Reviews } = await res.json();
      // console.log('Fetched reviews for spot with ID:', spotId);
      // dispatch(getAllReviews(normalizeArr(Reviews)));
      dispatch(getReviewBySoptId(Reviews));
      // dispatch(getAllSpots(Spots));
      return Reviews;
    } else {
      const errors = await res.json();
      // console.log('Error fetching reviews for spot with ID:', spotId, errors);
      return errors;
    }
  } catch (error) {
    // console.error('Error fetching reviews for spot with ID:', spotId, error);
  }
};

// ***************************getSingleReviewThunk**************************
// these functions hit routes
export const getSingleReviewThunk = (reviewId) => async (dispatch) => {
  try {
    const res = await fetch(`/api/reviews/${reviewId}`);

    if (res.ok) {
      const { review } = await res.json();
      // console.log('Fetched review with ID:', reviewId);
      // dispatch(getAllReviews(normalizeArr(Reviews)));
      dispatch(getSingleReview(review));
      // dispatch(getAllSpots(Spots));
      return review;
    } else {
      const errors = await res.json();
      console.log('Error fetching review with ID:', reviewId, errors);
      return errors;
    }
  } catch (error) {
    console.error('Error fetching review with ID:', reviewId, error);
  }
};

// ***************************updateReviewThunk**************************
// these functions hit routes
export const updateReviewThunk = (review) => async (dispatch) => {
  try {
    const res = await fetch(`/api/reviews/${review.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(review)
    });

    if (res.ok) {
      const { review } = await res.json();
      // console.log('Updated review with ID:', review.id);
      // dispatch(getAllReviews(normalizeArr(Reviews)));
      dispatch(updateReview(review));
      // dispatch(getAllSpots(Spots));
      return review;
    } else {
      const errors = await res.json();
      console.log('Error updating review with ID:', review.id, errors);
      return errors;
    }
  } catch (error) {
    console.error('Error updating review with ID:', review.id, error);
  }
};

// ***************************normalizeArr**************************
function normalizeArr(reviews) {
  const normalizedReviews = {};
  reviews.forEach((review) => (normalizedReviews[reviews.id] = review));
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
const initialState = { allSpots: {}, singleSpot: {}, reviews: { spot: {}, user: {} }, isLoading: true };

export default function reviewReducer(state = initialState, action) {
  let newState;
  switch (action.type) {
    case GET_ALL_REVIEWS:
      newState = { ...state, spot: {} };
      newState.spot = action.reviews;
      // normalize this array into state
      // newState = structuredClone(state);
      // action.spots.forEach((spot) => {
      // 	newState.allSpots[spot.id] = spot;
      // });
      return newState;
    case GET_REVIEW_BY_SOPT_ID:
      newState = { ...state, spot: {} };
      newState.spot = action.reviews;
      return newState;

    case GET_USER_REVIEWS:
      // const userReviewsById = getUserReviewsById(action.payload);
      // return { ...state, user: userReviewsById }
      let returnObj={}
      action.payload.forEach((ele)=>{
        returnObj[ele.id]={
          userId:ele.userId,
          spotId:ele.spotId,
          review:ele.review,
          stars:ele.stars,
          createdAt:ele.createdAt,
          updatedAt:ele.updatedAt,
          User: ele.User,
          ReviewImages:ele.ReviewImages,
        }
      })
      newState={...state,user:returnObj}
        // let newState={...state,spot:action.payload}
      return newState


    case DELETE_REVIEW:
      newState = {...state.reviews.spot}
      return newState[action.reviewId];
      // newState = { ...state, singleSpot: {} };
      // newState.singleSpot = {};
      // delete newState.allSpots[action.id];
      // return newState;
      // case UPDATE_SINGLE_REVIEW:
      //   // newState = { ...state, singleSpot: {} };
      //   newState = { ...state, singleSpot: {} };
      //   newState.singleSpot = action.spot;
      //   return newState;
    default:
      return state;
  }
}



























// }
















//   }
//  catch (error) {
//   console.log(error)
//   throw error;
//  }



// }


// export const ThunkAddNewSpot=(dispatch,body)=>async dispatch =>{


//   const res = await fetch("/api/spots",{
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify(body)
//   });


//   if(res.ok) {
//     const  {Spots}  = await res.json();
//     console.log('spots is',Spots)
// dispatch(actionLoadSpots(Spots))


//   } else {
//     const errors = await res.json();
//     console.error('Error fetching data:', errors);
//   }


// 3. reducer - always return an object
// let initialState={spot:{},user:{}}
// export default function reviewsReducer(state=initialState, action) {
//   switch (action.type) {
//     case LOAD_REVIEWS_BY_SPOTID: {
//       let returnObj={}
//       action.payload.forEach((ele)=>{




    //     returnObj[ele.id]={
    //       userId:ele.userId,
    //       spotId:ele.spotId,
    //       review:ele.review,
    //       stars:ele.stars,
    //       createdAt:ele.createdAt,
    //       updatedAt:ele.updatedAt,
    //       User: ele.User,
    //       ReviewImages:ele.ReviewImages,
    //     }
    //   })
    //   let newState={...state,spot:returnObj}




    //     // let newState={...state,spot:action.payload}
    //   return newState
    // }
    // case GET_USER_REVIEWS: {
    //   let returnObj={}
    //   action.payload.forEach((ele)=>{




      //   returnObj[ele.id]={
      //     userId:ele.userId,
      //     spotId:ele.spotId,
      //     review:ele.review,
      //     stars:ele.stars,
      //     createdAt:ele.createdAt,
      //     updatedAt:ele.updatedAt,
      //     User: ele.User,
      //     ReviewImages:ele.ReviewImages,
      //   }
      // })
      // let newState={...state,user:returnObj}




        // let newState={...state,spot:action.payload}
//       return newState
//     }
//     case DELETE_REVIEW: {
//       let newState={...state,spot: action.payload}
//       return newState
//     }
//     case GET_REVIEW_BY_SOPT_ID: {




//       let {Review,objReviews}=action.payload
//       console.log('inside of our reducer')
//       console.log('review is just ',Review)
//       console.log('objReviews is',objReviews)
//       let returnObj={}
//       let review=objReviews
//       let ourId=Review.id
//       let keysToThis=Object.keys(objReviews)
//       let UserObject=Review.User
//       let ReviewImagesArray=Review["ReviewImages"]
//         returnObj={
//           userId: Review.userId,
//           spotId: Review.spotId,
//           review: Review.review,
//           stars: Review.stars,
//           createdAt: Review.createdAt,
//           updatedAt: Review.updatedAt,
//           User: UserObject,
//           ReviewImages:ReviewImagesArray,




//       }
//       let newVar=JSON.stringify(objReviews)
//       let newVar2=JSON.parse(newVar)
//       let newState={...state,spot: {ourId:returnObj,...objReviews}}
//       console.log('NEWSTATE IN OUR REVIEW THUNK IS',newState)
//       return newState
//     }
//     // case LOAD_SPOTS: {
//     //   let newState={...state,
//     //     allSpots: action.payload,}
//     //   return newState
//     // }
//     // case LOAD_SPOT: {
//     //   let newState={...state,
//     //     singleSpot: action.payload}
//     //   return newState
//     //   }
//     //   case ADD_SPOT: {
//     //     let allPrevSpots=state.allSpots
//     //     let ourId=action.payload.id
//     //     let newState={...state,
//     //     allSpots: {...allPrevSpots,[ourId]:action.payload}}
//     //     return newState
//     //   }




//     //   // {...state,singleSpot: {...action.payload,Owner:{...action.payload.Owner}}}




//     // // case ADD_USER: {
//     // //   return state
//     // // }
//     // case UPDATE_SPOT: {
//     //   return state
//     // }
//     // // case DELETE_SPOT: {
//     // //   const newState = { ...state, allSpots:{ ...state.allSpots } }; // -> {allSpots: { 1: {}}, singleSpot: {} }
//     // //   delete newState.allSpots[action.id] // deleting id 1
//     // //   return newState
//     // // }




//     default: {
//       return state;
//     }




//   }


// }
