import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate  } from "react-router-dom";
import { getAllSpotsThunk, getOwnerAllSpotsThunk } from "../../../store/spots";
import OpenModalButton from "../../OpenModalButton";
import DeleteSpot from "../DeleteSpot/DeleteSpot";

import "./GetAllSpots.css";

export default function GetAllSpots({ ownerMode = false }) {

  const spots = Object.values(useSelector((state) => (state.spots.allSpots ? state.spots.allSpots : [])));
  const sessionUser = useSelector((state) => state.session.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (ownerMode) dispatch(getOwnerAllSpotsThunk());
    else dispatch(getAllSpotsThunk());
  }, [dispatch, ownerMode]);
  
  const spotsToDisplay = ownerMode ? spots.filter((spot) => spot.ownerId === sessionUser.id) : spots;

  return (
    <>
      <div className="spots-main-container">
        {spotsToDisplay &&
          spotsToDisplay.map((spot) => (
            <div className="spot-wrapper" key={spot.id}>
              <Link to={`/spots/${spot.id}`} style={{ textDecoration: "none", color: "var(--black)" }}>
                <div className={ ownerMode ? "ownerSpot-box" : "spot-box"} title={spot.name}>
                  <img src={spot.previewImage} className={ ownerMode ? "ownerSpot-img" : "spot-img"} alt={spot.name} />
                  <div className="spot-info-flex">
                    {/* <h3 className="spot-title">{spot.name}</h3> */}
                    <div className="spot-city-state-rating-div">
                      <p>{`${spot.city}, ${spot.state}`}</p>
                      {spot.avgRating ? ( <p>★{spot.avgRating.toFixed(1)}</p> ) : ( <p>★New</p>)}
                    </div>
                    <div className="price-div">
                      <p className="p-style"><span className="span-style">${spot.price}</span> night{" "}</p>
                    </div>
                  </div>
                </div>
              </Link>
              {ownerMode && (
                <div className="update-delete-btns">
                  <button className="update-btn" onClick={() => navigate(`/spots/edit/${spot.id}`)}> Update </button>
                  <OpenModalButton buttonText="Delete" modalComponent={<DeleteSpot spotId={spot.id} />}/>
                </div>
              )}
            </div>
          ))}
      </div>
    </>
  );
}
