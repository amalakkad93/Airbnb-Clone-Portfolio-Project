import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllSpotsThunk } from "../../../store/spots";
import { Link } from "react-router-dom";
import "./GetAllSpots.css";

export default function GetAllSpots() {
  // const spots = useSelector((state) => state.spots.allSpots);
  const spots = Object.values(useSelector((state) => ( state.spots.allSpots ? state.spots.allSpots : [])));
  // const spotArr = Object.values(spots);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllSpotsThunk());
  }, [dispatch]);

  console.log("*************spots", spots);

  return (
    <>
      <div className="spots-main-container">
        {spots && spots.map((spot) => (
            <Link
              to={`/spots/${spot.id}`}
              style={{ textDecoration: "none", color: "var(--black)" }}
            >
              <div className="spot-box" title={spot.name}>

                <img src={spot.previewImage} className="spot-img" alt={spot.name}/>

                <div className="spot-info-flex">
                  {/* <h3 className="spot-title">{spot.name}</h3> */}
                  <div className="spot-city-state-rating-div">

                  <p>{`${spot.city}, ${spot.state}`}</p>
                  { spot.avgRating ? <p>⭐{spot.avgRating.toFixed(1)}</p> : <p>⭐New</p> }

                  </div>
                  <div className="price-div">
                    <p className="p-style"><span className="span-style">${spot.price}</span> night </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
      </div>
    </>
  );
}
