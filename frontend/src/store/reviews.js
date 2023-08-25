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
    // console.error('Error fetching reviews:', error);
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
      return newState;
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
