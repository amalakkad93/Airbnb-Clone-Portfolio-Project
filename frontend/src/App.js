// // frontend/src/App.js
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Routes, Route } from "react-router-dom";  // Updated import

import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import GetSpots from "./components/Spots/GetSpots";
import GetSpotDetail from "./components/Spots/GetSpotDetail";
import CreateSpotForm from "./components/Spots/SpotForm/CreateSpotForm";
import EditSpotForm from "./components/Spots/SpotForm/EditSpotForm";
import UserProfile from "./components/UserProfile/UserProfile";

// import CreateReviewModal from "./components/Reviews/ReviewModals/CreateReviewModal";
import DeleteReviewModal from "./components/Reviews/ReviewModals/DeleteReviewModal";
import './index.css'

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>

      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Routes>
          <Route path="/" element={<GetSpots />} />
          <Route path="/spots/new" element={<CreateSpotForm />} />
          <Route path="/users/show" element={<UserProfile/>} />
          <Route path="/spots/edit/:spotId" element={<EditSpotForm />} />
          {/* <Route path="/reviews/new" element={<CreateReviewModal />} /> */}
          {/* <Route path="/reviews/:reviewId" element={<DeleteReviewModal />} /> */}
          <Route path="/spots/:spotId" element={<GetSpotDetail />} />
          {/* <Route path="/owner/spots" element={<SpotsOwner />} /> */}
          <Route path="/owner/spots" element={<GetSpots ownerMode={true}/>} />
          <Route>Page Not Found</Route>
        </Routes>
      )}

    </>
  );
}
export default App;
