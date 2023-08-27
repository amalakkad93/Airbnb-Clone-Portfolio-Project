import { csrfFetch } from "./csrf";

// ************************************************
//                   ****types****
// ************************************************
const GET_ALL_SPOTS = "/get_all_spots"; //read. // GET spots/
const GET_SINGLE_SPOTS = "/GETOneSpot"; //SPOT_DETAIL // "spots/getSpotDetail"
const CREATE_SPOT = "CREATEOneSpot";
const UPDATE_SPOT = "UPDATEOneSpot";
const DELETE_SPOT = "DELETEOneSpot";
const GET_ALL_SPOTS_OF_CURRENT_USER = "/get_all_spots_of_user"; //read. // GET spots/

// ************************************************
//                   ****action creator****
// ************************************************
const actionGetSpots = (spots) => ({type: GET_ALL_SPOTS, spots});
const actionGetSingleSpot = (spot) => ({ type: GET_SINGLE_SPOTS, spot });
const actionCreateSpot = (spot) =>({ type: CREATE_SPOT, spot});
const actionUpdateSpot = (spot) => ({ type: UPDATE_SPOT, spot});
const actionDeleteSpot = (id) => ({ type: DELETE_SPOT, id });
const actionGetAllOwnerSpots = (spots) => ({ type: GET_ALL_SPOTS_OF_CURRENT_USER, spots });

// ************************************************
//                   ****Thunks****
// ************************************************
// ***************************getAllSpotsThunk**************************
// these functions hit routes
export const getAllSpotsThunk = () => async (dispatch) => {
  const res = await csrfFetch("/api/spots");
  if (res.ok) {
    const { Spots } = await res.json(); // { Spots: [] }
    dispatch(actionGetSpots(normalizeArr(Spots)));
    return Spots;
  } else {
    const errors = await res.json();
    return errors;
  }
};

// ***************************getSpotDetailThunk**************************
export const getSpotDetailThunk = (spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}`);

  if (res.ok) {
    const Spot = await res.json();

    // console.log("spot data FROM getSpotDetailThunk:", spot);
    dispatch(actionGetSingleSpot(Spot));
    return Spot;
  } else {

    const errors = await res.json();
    return errors;
  }
};

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
    dispatch(actionCreateSpot(newlyCreateSpot));
    return newlyCreateSpot;
  } else {
    const errors = res.json();
    return errors;
  }
}

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

// ***************************deleteSpotThunk**************************
// these functions hit routes
export const deleteSpotThunk = (spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}`, {
    method: 'DELETE',
  });

  if (res.ok) {
    await dispatch(actionDeleteSpot(spotId));
  }
  // return res;
};

// ***************************getOwnerAllSpotsThunk**************************
// these functions hit routes
export const getOwnerAllSpotsThunk = () => async (dispatch) => {
  const res = await csrfFetch("/api/spots/current");

  if (res.ok) {
    const Spots  = await res.json(); // { Spots: [] }
    // do the thing with this data
    // console.log("Spots from getOwnerAllSpotsThunk:", Spots)
    dispatch(actionGetAllOwnerSpots(Spots));
    // dispatch(getAllSpots(Spots))
    return Spots;
  } else {
    const errors = await res.json();

    return errors;
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
      return newState;

    case GET_SINGLE_SPOTS:
      newState = { ...state, singleSpot: {} };
      newState.singleSpot = action.spot;
      return newState;

    case CREATE_SPOT:
      // newState = { ...state, singleSpot: {} };
      newState = { ...state };
      // newState.allSpots[action.spot.id] = action.spot;
      newState.singleSpot = action.spot;
      return newState;

    case UPDATE_SPOT:
      // newState = { ...state, singleSpot: {} };
      newState = { ...state, singleSpot: {} };
      newState.singleSpot = action.spot;
      return newState;

    case DELETE_SPOT:
      newState = { allSpots: {...state.allSpots}, singleSpot: {} }; // newState = { ...state, allSpots: {...state.allSpots}, singleSpot: {} };
      delete newState.allSpots[action.id];
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
