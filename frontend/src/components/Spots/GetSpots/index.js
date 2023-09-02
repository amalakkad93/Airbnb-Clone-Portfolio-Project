import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, NavLink } from "react-router-dom";
import { getAllSpotsThunk, getOwnerAllSpotsThunk } from "../../../store/spots";
import OpenModalButton from "../../OpenModalButton";
import DeleteSpot from "../DeleteSpot/DeleteSpot";

import "./GetSpots.css";

export default function GetSpots({ ownerMode = false }) {

  const spots = Object.values(useSelector((state) => (state.spots.allSpots ? state.spots.allSpots : [])));
  const sessionUser = useSelector((state) => state.session.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (ownerMode) dispatch(getOwnerAllSpotsThunk());
    else dispatch(getAllSpotsThunk());
  }, [dispatch, ownerMode]);

  const spotsToDisplay = (ownerMode && sessionUser) ? spots.filter((spot) => spot.ownerId === sessionUser.id) : spots;
  const ownerSpots =  (ownerMode && sessionUser) ? spots.filter((spot) => spot.ownerId === sessionUser.id) : 1;
  // console.log("ownerSpots = ", ownerSpots.length)

  if(!spots || !spotsToDisplay) return null;
  return (
    <>
      <div className="main-container">
        {/* {(ownerMode && sessionUser) && (ownerSpots === null || ownerSpots.length <= 0) && ( */}
        {ownerMode && (
          <div className="owner-div manage-create-a-new-spot">
            <h2 className="manage-spots-h1-tag">Manage Your Spots</h2>
            {ownerSpots.length <= 0 &&
              <button className="owner-btn create-new-spot-btn">
                <NavLink to="/spots/new" className="create-new-spot-owner" style={{ textDecoration: "none", color: "var(--white)"}}>Create a New Spot</NavLink>
              </button>
            }
          </div>
        )}
        <div className="spots-main-container grid-container">
          {spotsToDisplay &&
            spotsToDisplay.map((spot) => (
              <div className="spot-img-main-div" key={spot.id}>
                <Link to={`/spots/${spot.id}`} style={{ textDecoration: "none", color: "var(--black)" }}>
                <div className={`spot-box ${ownerMode ? "ownerSpot" : ""}`} title={spot.name}>
                    <img src={spot.previewImage} className={ ownerMode ? "ownerSpot-img" : "spot-img"} alt={spot.name} />
                    <div className="spot-info-flex">
                      {/* <h3 className="spot-title">{spot.name}</h3> */}
                      <div className="spot-city-state-rating-div">
                        <p className="p-card-style">{`${spot.city}, ${spot.state}`}</p>
                        {/* {spot.avgRating ? ( <p className="avgRating-p-tag">★{spot.avgRating.toFixed(1)}</p> ) : ( <p className="boldText">★New</p> )} */}
                        <p className="avgRating-p-tag">★{spot.avgRating ? spot.avgRating.toFixed(1) : <span className="boldText">New</span>}</p>
                      </div>
                      <div className="price-div">
                        <p className="p-style"><span className="span-style">${spot.price}</span> night{" "}</p>
                      </div>
                    </div>
                    {/* <div></div> */}
                  </div>
                </Link>
                {ownerMode && (
                  <div className="owner-div update-delete-btns">

                    <button className="owner-btn post-delete-review-btn" onClick={() => navigate(`/spots/edit/${spot.id}`)}> Update </button>
                    <OpenModalButton buttonText="Delete" modalComponent={<DeleteSpot spotId={spot.id} />}/>
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>
    </>
  );
}
// className="p-card-style"
