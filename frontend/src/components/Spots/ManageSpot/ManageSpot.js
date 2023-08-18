import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { getAllSpotsThunk } from "../../../store/spots";
import { getOwnerAllSpotsThunk } from "../../../store/spots";

import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import OpenModalButton from "../../OpenModalButton";
import DeleteSpot from "../DeleteSpot/DeleteSpot";
// import "./spots.css";

export default function SpotItem() {
  const spots = useSelector((state) => state.spots.allSpots);
  const spotArr = Object.values(spots);
  const navigate = useNavigate();

  const dispatch = useDispatch();

  useEffect(() => {
    // dispatch inside the thunk
    dispatch(getOwnerAllSpotsThunk()); // -> [{}, ...]
  }, [dispatch]);

  if(!spotArr) return null

  return (
    <>
      <h1>Manage Spots</h1>
      <div className="spots-box">
        {spotArr && spotArr.map((spot) => (
          <div key={spot.id}>
            <Link to={`/spots/${spot.id}`}>
              <div className="spot-box">
                <img
                  src={spot.previewImage}
                  className="spot-img"
                  alt={spot.name}
                />
                <div className="spot-info-flex">
                  {/* <h3 className="spot-title">{spot.name}</h3> */}
                  <div className="spot-city-state-rating">
                    <p>{`${spot.city}, ${spot.state}`}</p>
                    <p>{spot.avgRating}</p>
                  </div>
                  <p style={{ margin: "0.2rem", fontSize: "1rem", color: "var(--black" }}>
                    <span style={{ fontWeight: "600" }}>${spot.price}</span> night
                  </p>
                </div>
              </div>
            </Link>
            <div className="edit-delete-btns">
              <button className="edit-btn" onClick={(e) => navigate(`/spots/edit/${spot.id}`)}>Edit</button>
              <OpenModalButton
                buttonText="Delete"
                modalComponent={<DeleteSpot spotId={spot.id} />}
              />
            </div>
          </div>
        ))}
      </div>
    </>
  );



  // only use map inside do not use forEach
//   return (
//     <>
//       <h1>Manage Spots</h1>
//       {/* <div className="spots-box"> */}
//       <div className="spots-box">
//         {spotArr && spotArr.map((spot) => (
//           <>

//           <Link to={`/spots/${spot.id}`}>
//             <div className="spot-box">
//               <img
//                 src={spot.previewImage}
//                 className="spot-img"
//                 alt={spot.name}
//               />

//               {/* <p> detail</p> */}
//               <div className="spot-info-flex">
//                 {/* <h3 className="spot-title">{spot.name}</h3> */}
//                 <div className="spot-city-state-rating">
//                   <p>{`${spot.city}, ${spot.state}`}</p>
//                   <p>{spot.avgRating}</p>
//                 </div>

//                 <p style={{ margin: "0.2rem", fontSize: "1rem", color: "var(--black",}}>
//                   <span style={{ fontWeight: "600" }}>${spot.price}</span> night
//                 </p>
//               </div>

//             </div>
//             </Link>
//               <div className="edit-delete-btns">
//             {/* <Link to={`/spots/edit/${spot.id}`}> */}
//                 <button className="edit-btn" onClick={(e)=> history.push(`/spots/edit/${spot.id}`)}>Edit</button>
//             {/* </Link> */}
//             {/* <Link to={`/spots/${spot.id}/delete`}>
//                 <button className="delete-btn">Delete</button>
//             </Link> */}
//             <OpenModalButton
//               buttonText="Delete"
//               modalComponent={<DeleteSpot spotId={spot.id} />}
//              />
//               </div>
//             </>
//         ))}
//       </div>
//     </>
//   );
}
