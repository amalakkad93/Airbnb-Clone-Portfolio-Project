// // import {useDispatch} from 'react-redux';
// import { csrfFetch } from "./csrf";
// import { getAllReviews } from "./reviews";

// // ************************************************
// //                   ****types****
// // ************************************************
// const GET_ALL_SPOTS = "/get_all_spots"; //read. // GET spots/
// const GET_ALL_SPOTS_OF_CURRENT_USER = "/get_all_spots_of_user"; //read. // GET spots/
// const GET_SINGLE_SPOTS = "/get_single_spots"; //SPOT_DETAIL // "spots/getSpotDetail"
// const UPDATE_SINGLE_SPOT = "UPDATE_SINGLE_SPOT";
// const DELETE_SPOT = "DELETE_SPOT";
// const CREATE_SPOT = "CREATE_SPOT";

// // ************************************************
// //                   ****action creator****
// // ************************************************
// export const getSpots = (spots) => ({ type: GET_ALL_SPOTS, spots });
// export const getAllOwnerSpots = (spots) => ({ type: GET_ALL_SPOTS_OF_CURRENT_USER, spots });
// export const getSingleSpot = (spot) => ({ type: GET_SINGLE_SPOTS, spot });
// export const updateSpot = (spot) => ({ type: UPDATE_SINGLE_SPOT, spot});
// export const  deleteSpot = (id) => ({ type: DELETE_SPOT, id });
// export const createSpot = (spot) =>({ type: CREATE_SPOT, spot});

// export const getAllSpots = state => state?.spots ? Object.values(state.spots) : [];
// console.log("************************************getAllSpots", getAllSpots);
// export const getSpot = spotId => state => state?.spots ? state.spots[spotId] : null;

// // export const fetchSpots = () => async (dispatch) => {
// //   const req = await fetch('/api/spots');
// //   const data = await req.json();
// //   const spots = data;
// //   const reviews = {};
// //   for (let spot of spots) {
// //     if ('Reviews' in spot) {
// //       for (let review of spot.Reviews) {
// //         reviews[review.id] = review;
// //       }
// //       delete spot.Reviews;
// //     }
// //   }
// //   dispatch(getSpots(spots));
// //   dispatch(getReviews(reviews));
// //   return { spots, reviews };
// // };



// // export const fetchSpots = () => async (dispatch) => {
// //   try {
// //     const req = await fetch('/api/spots');
// //     const data = await req.json();
// //     const spots = data;

// //     // Extract and organize reviews separately
// //     const reviews = {};
// //     for (let spot of spots) {
// //       if ('Reviews' in spots) {
// //         for (let review of spot.Reviews) {
// //           reviews[review.id] = review;
// //         }
// //         delete spot.Reviews;
// //       }
// //     }

// //     dispatch(getSpots(data));
// //     dispatch(getAllReviews(reviews));

// //     return { spots: data, reviews };
// //   } catch (err) {
// //     console.error("Error fetching spots:", err.message);
// //     throw err;
// //   }
// // };


// // ************************************************
// //                   ****Thunks****
// // ************************************************

// // ***************************createSpotThunk***************************
// export const createSpotThunk = (newSpot, newSpotImage, sessionUser) => async (dispatch) => {

//   const res = await csrfFetch("/api/spots", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(newSpot),
//   })

//   if (res.ok) {
//     const newlyCreateSpot = await res.json();

//     const newImagesRes = await Promise.all(newSpotImage.map(async (imageObj) => {
//       const imageRes = await csrfFetch(`/api/spots/${newlyCreateSpot.id}/images`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(imageObj),
//       });
//       if(imageRes.ok) {
//         const imageData = await imageRes.json();
//         return imageData;
//       }
//     }));
//     newlyCreateSpot.SpotImages = newImagesRes;
//     newlyCreateSpot.creatorName = sessionUser.username;
//     dispatch(createSpot(newlyCreateSpot));
//     return newlyCreateSpot;
//   }
// }


// // ***************************getAllSpotsThunk**************************
// // these functions hit routes
// export const getAllSpotsThunk = () => async (dispatch) => {
//   const res = await csrfFetch("/api/spots");

//   if (res.ok) {
//     const { Spots } = await res.json(); // { Spots: [] }
//     // do the thing with this data
//     dispatch(getSpots(normalizeArr(Spots)));
//     // dispatch(getAllSpots(Spots))
//     return Spots;
//   } else {
//     const errors = await res.json();
//     return errors;
//   }
// };
// // ***************************getOwnerAllSpotsThunk**************************
// // these functions hit routes
// export const getOwnerAllSpotsThunk = () => async (dispatch) => {
//   const res = await csrfFetch("/api/spots/current");

//   if (res.ok) {
//     const Spots  = await res.json(); // { Spots: [] }
//     // do the thing with this data
//     // console.log("Spots from getOwnerAllSpotsThunk:", Spots)
//     dispatch(getAllOwnerSpots(Spots));
//     // dispatch(getAllSpots(Spots))
//     return Spots;
//   } else {
//     const errors = await res.json();
//     console.log("spot NOT OK getOwnerAllSpotsThunk:")
//     return errors;
//   }
// };

// // ***************************deleteSpotThunk**************************
// // these functions hit routes
// export const deleteSpotThunk = (spotId) => async (dispatch) => {
//   const res = await csrfFetch(`/api/spots/${spotId}`, {
//     method: 'DELETE',
//   });

//   if (res.ok) {
//     await dispatch(deleteSpot(spotId));
//   }

//   // return res;
// };

// // ***************************getSpotDetailThunk***************************
// export const getSpotDetailThunk = (spotId) => async (dispatch) => {
//   console.log("************************getSpotDetailThunk:", spotId);
//   try {
//     const res = await csrfFetch(`/api/spots/${spotId}`);

//     if (!res.ok) {
//       throw new Error('Failed to get spot details');
//     }

//     const spot = await res.json();
//     dispatch(getSingleSpot(spot));
//     console.log("************************getSpotDetailThunk:", spot);
//     return spot;
//   } catch (err) {
//     console.error("Error fetching spot details:", err.message);
//     throw err;
//   }
// };

// // ***************************updateSpotThunk**************************
// // these functions hit routes
// export const updateSpotThunk = (updatedSpot) => async (dispatch) => {
//   console.log("*************updateSpotThunk*************", updatedSpot.id)
//   try {
//     const res = await csrfFetch(`/api/spots/${updatedSpot.id}`, {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify(updatedSpot)
//     });

//     if (!res.ok) {
//       throw new Error('Failed to update spot');
//     }

//     const data = await res.json();
//     const editedSpot = data;
//     dispatch(getSpotDetailThunk(editedSpot));
//     return editedSpot;
//   } catch (err) {
//     console.error("*****Error updating spot******* Error: ", err.message);
//     throw err;
//   }
// };



// // ***************************normalizeArr**************************
// function normalizeArr(spots) {
//   const normalizedSpots = {};
//   spots.forEach((spot) => (normalizedSpots[spot.id] = spot));
//   return normalizedSpots;
// }

// // ************************************************
// //                   ****Reducer****
// // ************************************************
// const initialState = { allSpots: {}, singleSpot: {} };

// export default function spotReducer(state = initialState, action) {
//   let newState;
//   switch (action.type) {
//     case GET_ALL_SPOTS:
//       newState = { ...state, allSpots: {} };
//       newState.allSpots = action.spots;
//       // normalize this array into state
//       // newState = structuredClone(state);
//       // action.spots.forEach((spot) => {
//       // 	newState.allSpots[spot.id] = spot;
//       // });
//       return newState;
//     case GET_SINGLE_SPOTS:
//       newState = { ...state, singleSpot: {} };
//       newState.singleSpot = action.spot;
//       return newState;

//     case UPDATE_SINGLE_SPOT:
//       // newState = { ...state, singleSpot: {} };
//       newState = { ...state, singleSpot: {} };
//       newState.singleSpot = action.spot;
//       return newState;
//     case DELETE_SPOT:
//       newState = { allSpots: {...state.allSpots}, singleSpot: {} };
//       delete newState.allSpots[action.id];
//       return newState;
//     case CREATE_SPOT:
//       // newState = { ...state, singleSpot: {} };
//       newState = { ...state };
//       // newState.allSpots[action.spot.id] = action.spot;
//       newState.singleSpot = action.spot;
//       return newState;
//     case GET_ALL_SPOTS_OF_CURRENT_USER:
//       newState = { ...state, allSpots: {} };
//       // newState = { allSpots: {...state, allSpots: {}, singleSpot: {}} };
//       newState.allSpots = action.spots;

//       return newState;

//     default:
//       return state;
//   }
// }

// import {useDispatch} from 'react-redux';
import { csrfFetch } from "./csrf";
import { getAllReviews } from "./reviews";

// ************************************************
//                   ****types****
// ************************************************
const GET_ALL_SPOTS = "/get_all_spots"; //read. // GET spots/
const GET_ALL_SPOTS_OF_CURRENT_USER = "/get_all_spots_of_user"; //read. // GET spots/
const GET_SINGLE_SPOTS = "/get_single_spots"; //SPOT_DETAIL // "spots/getSpotDetail"
const UPDATE_SINGLE_SPOT = "UPDATE_SINGLE_SPOT";
const DELETE_SPOT = "DELETE_SPOT";
const CREATE_SPOT = "CREATE_SPOT";

// ************************************************
//                   ****action creator****
// ************************************************
export const getSpots = (spots) => ({ type: GET_ALL_SPOTS, spots });
export const getAllOwnerSpots = (spots) => ({ type: GET_ALL_SPOTS_OF_CURRENT_USER, spots });
export const getSingleSpot = (spot) => ({ type: GET_SINGLE_SPOTS, spot });
export const updateSpot = (spot) => ({ type: UPDATE_SINGLE_SPOT, spot});
export const  deleteSpot = (id) => ({ type: DELETE_SPOT, id });
export const createSpot = (spot) =>({ type: CREATE_SPOT, spot});

export const getAllSpots = state => state?.spots ? Object.values(state.spots) : [];
export const getSpot = spotId => state => state?.spots ? state.spots[spotId] : null;


// ************************************************
//                   ****Thunks****
// ************************************************

// ***************************createSpotThunk***************************
export const createSpotThunk = (newSpot, newSpotImage, sessionUser) => async (dispatch) => {

  const res = await csrfFetch("/api/spots", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newSpot),
  })

  if (res.ok) {
    const newlyCreateSpot = await res.json();

    const newImagesRes = await Promise.all(newSpotImage.map(async (imageObj) => {
      const imageRes = await csrfFetch(`/api/spots/${newlyCreateSpot.id}/images`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(imageObj),
      });
      if(imageRes.ok) {
        const imageData = await imageRes.json();
        return imageData;
      }
    }));
    newlyCreateSpot.SpotImages = newImagesRes;
    newlyCreateSpot.creatorName = sessionUser.username;
    dispatch(createSpot(newlyCreateSpot));
    return newlyCreateSpot;
  }
}

// ***************************getSpotDetailThunk***************************
export const getSpotDetailThunk = (spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}`);

  if (res.ok) {
    const spot = await res.json();

    // console.log("spot data FROM getSpotDetailThunk:", spot);
    dispatch(getSingleSpot(spot));
    return spot;
  }else {
    
    const errors = await res.json();
    return errors;
  }
};
// export const getSpotDetailThunk = (spotId) => async (dispatch) => {
//   try {
//     const res = await csrfFetch(`/api/spots/${spotId}`);

//     // if (!res.ok) {
//     //   const errors = await res.json();
//     //   throw new Error(errors.message || "================Failed to get spot details=============");
//     // }

//     const spot = await res.json();
//     dispatch(getSingleSpot(spot));
//     console.log("************************getSpotDetailThunk:", spot);
//     return spot;
//   } catch (err) {
//     console.error("Error fetching spot details:", err.message);
//     throw err;
//   }
// };

// ***************************getAllSpotsThunk**************************
// these functions hit routes
export const getAllSpotsThunk = () => async (dispatch) => {
  const res = await csrfFetch("/api/spots");
  // const res = await fetch("/api/spots");

  if (res.ok) {
    const { Spots } = await res.json(); // { Spots: [] }
    // do the thing with this data
    dispatch(getSpots(normalizeArr(Spots)));
    // dispatch(getAllSpots(Spots))
    return Spots;
  } else {
    const errors = await res.json();
    return errors;
  }
};
// ***************************getOwnerAllSpotsThunk**************************
// these functions hit routes
export const getOwnerAllSpotsThunk = () => async (dispatch) => {
  const res = await csrfFetch("/api/spots/current");

  if (res.ok) {
    const Spots  = await res.json(); // { Spots: [] }
    // do the thing with this data
    // console.log("Spots from getOwnerAllSpotsThunk:", Spots)
    dispatch(getAllOwnerSpots(Spots));
    // dispatch(getAllSpots(Spots))
    return Spots;
  } else {
    const errors = await res.json();

    return errors;
  }
};

// ***************************deleteSpotThunk**************************
// these functions hit routes
export const deleteSpotThunk = (spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}`, {
    method: 'DELETE',
  });

  if (res.ok) {
    await dispatch(deleteSpot(spotId));
  }

  // return res;
};

// ***************************updateSpotThunk**************************
// these functions hit routes
export const updateSpotThunk = (updatedSpot) => async (dispatch) => {


try {
  const res = await csrfFetch(`/api/spots/${updatedSpot.id}`, {
  // const req = await csrfFetch(`/api/spots/${spotId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(updatedSpot)
  });

  const data = await res.json();
  const editedSpot = data;
  dispatch(getSpotDetailThunk(editedSpot.id));
  return editedSpot;

} catch(err) {
  console.error("*****Error updating spot******* Error: ", err.message);
    throw err;
}
};


// ***************************normalizeArr**************************
function normalizeArr(spots) {
  const normalizedSpots = {};
  spots.forEach((spot) => (normalizedSpots[spot.id] = spot));
  return normalizedSpots;
}

// ************************************************
//                   ****Reducer****
// ************************************************
const initialState = { allSpots: {}, singleSpot: {} };

export default function spotReducer(state = initialState, action) {
  let newState;
  switch (action.type) {
    case GET_ALL_SPOTS:
      newState = { ...state, allSpots: {} };
      newState.allSpots = action.spots;
      // normalize this array into state
      // newState = structuredClone(state);
      // action.spots.forEach((spot) => {
      // 	newState.allSpots[spot.id] = spot;
      // });
      return newState;
    case GET_SINGLE_SPOTS:
      newState = { ...state, singleSpot: {} };
      newState.singleSpot = action.spot;
      return newState;

    case UPDATE_SINGLE_SPOT:
      // newState = { ...state, singleSpot: {} };
      newState = { ...state, singleSpot: {} };
      newState.singleSpot = action.spot;
      return newState;
    case DELETE_SPOT:
      newState = { allSpots: {...state.allSpots}, singleSpot: {} };
      delete newState.allSpots[action.id];
      return newState;
    case CREATE_SPOT:
      // newState = { ...state, singleSpot: {} };
      newState = { ...state };
      // newState.allSpots[action.spot.id] = action.spot;
      newState.singleSpot = action.spot;
      return newState;
    case GET_ALL_SPOTS_OF_CURRENT_USER:
      newState = { ...state, allSpots: {} };
      // newState = { allSpots: {...state, allSpots: {}, singleSpot: {}} };
      newState.allSpots = action.spots;

      return newState;

    default:
      return state;
  }
}
