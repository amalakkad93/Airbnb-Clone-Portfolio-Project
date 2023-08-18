// // frontend/src/App.js
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Routes, Route } from "react-router-dom";  // Updated import

import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import GetAllSpots from "./components/Spots/GetAllSpots";
import SpotDetail from "./components/Spots/SpotDetail";
import CreateSpotForm from "./components/Spots/SpotForms/CreateSpotForm";
import EditSpotForm from "./components/Spots/SpotForms/EditSpotForm";
import SpotItem from "./components/Spots/ManageSpot/ManageSpot";
import CreateReviewModal from "./components/Reviews/ReviewModals/CreateReviewModal";
import DeleteReviewModal from "./components/Reviews/ReviewModals/DeleteReviewModal";

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
          <Route path="/" element={<GetAllSpots />} />
          <Route path="/spots/new" element={<CreateSpotForm />} />
          <Route path="/spots/edit/:spotId" element={<EditSpotForm />} />
          <Route path="/reviews/new" element={<CreateReviewModal />} />
          <Route path="/reviews/:reviewId" element={<DeleteReviewModal />} />
          <Route path="/spots/:spotId" element={<SpotDetail />} />
          <Route path="/owner/spots" element={<SpotItem />} />
        </Routes>
      )}
    </>
  );
}
export default App;
