import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import sessionReducer from "./session";
import spotReducer from "./spots";
import reviewReducer from "./reviews";

// this constructs the SHAPE of your store
const rootReducer = combineReducers({
  session: sessionReducer,
  spots: spotReducer,  // (state={}, action) => ({ allSpots: {}, singleSpot: {}}),
  reviews: reviewReducer,
  // bookings: bookingReducer, // { userBookings: [], spotBookings: [] },
  // spotSearch: spotSearchReducer, // { results: [], page: null, size: null }
});

let enhancer;

if (process.env.NODE_ENV === "production") {
  enhancer = applyMiddleware(thunk);
} else {
  const logger = require("redux-logger").default;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const configureStore = (preloadedState) => {
  return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;
