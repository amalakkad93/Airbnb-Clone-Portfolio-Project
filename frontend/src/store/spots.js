import { csrfFetch } from "./csrf";

// ************************************************
//                   ****types****
// ************************************************
const GET_ALL_SPOTS = "/get_all_spots"; //read. // GET spots/
const GET_SINGLE_SPOTS = "/GETOneSpot"; //SPOT_DETAIL // "spots/getSpotDetail"

// ************************************************
//                   ****action creator****
// ************************************************
const actionGetSpots = (spots) => ({type: GET_ALL_SPOTS, spots});
const actionGetSingleSpot = (spot) => ({ type: GET_SINGLE_SPOTS, spot });

// ************************************************
//                   ****Thunks****
// ************************************************

// ***************************getAllSpotsThunk**************************
// these functions hit routes
export const getAllSpotsThunk = () => async (dispatch) => {
  const res = await csrfFetch("/api/spots");
  // const res = await fetch("/api/spots");

  if (res.ok) {
    const { Spots } = await res.json(); // { Spots: [] }
    // do the thing with this data
    dispatch(actionGetSpots(normalizeArr(Spots)));
    // dispatch(getAllSpots(Spots))
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

    default:
      return state;
  }
}
