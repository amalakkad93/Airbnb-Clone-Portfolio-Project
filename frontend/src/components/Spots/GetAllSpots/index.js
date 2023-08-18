// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { getAllSpotsThunk } from "../../../store/spots";
// import { Link } from "react-router-dom";
// import "./spots.css";

// export default function GetAllSpots() {
//   const spots = useSelector((state) => state.spots.allSpots);
//   const spotArr = Object.values(spots);
//   const dispatch = useDispatch();


//   useEffect(() => {
//     // dispatch inside the thunk
//     dispatch(getAllSpotsThunk()); // -> [{}, ...]
//   }, [dispatch]);

//   // only use map inside do not use forEach
//   return (
//     <>
//       {/* <h1>Home Page</h1> */}
//       <div className="spots-main-container">
//         <ul className="spots-box">
//           {spotArr.map((spot) => (
//             <li key={spot.id} className="spot-box">
//               <Link to={`/spots/${spot.id}`}>
//                 <img
//                   src={spot.previewImage}
//                   className="spot-img"
//                   alt={spot.name}
//                 />
//               </Link>

//             </li>
//         </ul>

//       </div>

//     </>
//   );
// }
// // after we dispatch...
// if(returnFromFetch.errors){
//   setErrors(returnFromFetch.errors)
// } else {
//   history.push(`/spots`)
// }

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllSpotsThunk } from "../../../store/spots";
import { Link } from "react-router-dom";
// import "./spots.css";
import "./AllSpots.css";

export default function GetAllSpots() {
  const spots = useSelector((state) => state.spots.allSpots);
  const spotArr = Object.values(spots);
  const dispatch = useDispatch();


  useEffect(() => {
    // dispatch inside the thunk
    dispatch(getAllSpotsThunk()); // -> [{}, ...]
  }, [dispatch]);

  // only use map inside do not use forEach
  return (
    <>
      {/* <h1>Home Page</h1> */}
      {/* <div className="spots-box"> */}
      <div className="spots-box">
        {spotArr.map((spot) => (
          <Link to={`/spots/${spot.id}`} className="no-underline">
            <div className="spot-box">
              <img
                src={spot.previewImage}
                className="spot-img"
                alt={spot.name}
              />
              {/* <p> detail</p> */}
              <div className="spot-info-flex">
                {/* <h3 className="spot-title">{spot.name}</h3> */}
                <div className="spot-city-state-rating">
                  <p>{`${spot.city}, ${spot.state}`}</p>
                  <p>{spot.avgRating.toFixed(1)}</p>
                </div>

                <p style={{ margin: "0.2rem", fontSize: "1rem", color: "var(--black",}}>
                  <span style={{ fontWeight: "600" }}>${spot.price}</span> night
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
// after we dispatch...
// if(returnFromFetch.errors){
//   setErrors(returnFromFetch.errors)
// } else {
//   history.push(`/spots`)
// }
