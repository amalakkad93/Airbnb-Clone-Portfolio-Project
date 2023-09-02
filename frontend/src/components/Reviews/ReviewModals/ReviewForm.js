// // ReviewForm.js
// import React, { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useParams } from 'react-router-dom';
// import { createReviewThunk, updateReview, getSingleReviewThunk } from '../../../store/reviews';;

// export default function ReviewForm({ formType, reviewId }) {
//   const dispatch = useDispatch();
//   const [rating, setRating] = useState(0);
//   const [validationError, setValidationError] = useState('');

//   const userId = useSelector(state => state.session.user?.id);
//   const spotId = useSelector(state => state.spots.spotDetail?.id);
//   const spot = useSelector((state) => state.spots.singleSpot);
//   const avgRating = spot.avgStarRating.toFixed(1);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!rating || rating < 1 || rating > 5) {
//       setValidationError('Please enter a valid rating between 1 and 5.');
//       return;
//     }

//     const reviewToCreate = {
//       rating,
//       spotId,
//       userId
//     };

//     if (formType === 'Create') {
//       const createdReview = await dispatch(createReviewThunk(reviewToCreate));
//       if (createdReview) {
//
//
//         console.log('Review created successfully!', createdReview);
//       }
//     }

//     if (formType === 'Edit') {
//       const updatedReview = await dispatch(updateReview({ id: reviewId, ...reviewToCreate }));
//       if (updatedReview) {
//         
//         console.log('Review updated successfully!', updatedReview);
//       }
//     }
//   };

//   useEffect(() => {
//     if (formType === 'Edit') {
//       dispatch(getSingleReviewThunk(reviewId))
//         .then(review => {
//           setRating(review.rating);
//         })
//         .catch(error => {
//           console.error('Error fetching review:', error.message);
//         });
//     }
//   }, [dispatch, formType, reviewId]);

//   return (
//     <div className="form-container">
//       <form onSubmit={handleSubmit}>
//         <h1>{formType === 'Create' ? 'Create a Review' : 'Update Your Review'}</h1>
//         {validationError && <p>{validationError}</p>}
//         <div>
//           <label htmlFor="rating">Rating:</label>
//           <input type="number" id="rating" value={rating} onChange={(e) => setRating(e.target.value)} />
//         </div>
//         <button type="submit">Submit</button>
//       </form>
//     </div>
//   );
// }
