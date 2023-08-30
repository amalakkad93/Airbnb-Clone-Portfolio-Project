import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../../context/Modal';
import { createReviewThunk } from '../../../store/reviews';
import StarRatingInput from '../../StarRatingInput/StarRatingInput';
import './CreateReviewModal.css';

export default function CreateReviewModal({ spotId, setReloadPage }) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();
    const [stars, setStars] = useState(0);
    const [review, setReview] = useState('');

    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(true);
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');

    const handleCreateReview = async () => {
        try {
            await dispatch(createReviewThunk(spotId, review, stars));
            closeModal();

            // If `reloadPage` is a boolean, you can toggle its value.
            setReloadPage(prevState => !prevState);

            // If `reloadPage` is a number or another type, adjust this line accordingly.
        } catch (error) {
            const data = await error.json();
            if (data && data.errors) setErrors(data.errors);
            else setMessage(data.message);
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        handleCreateReview();
    }

    const handleReviewChange = (e) => {
        const reviewText = e.target.value;
        setReview(reviewText);
        updateSubmitButtonDisabled(stars, reviewText);
    };

    const updateSubmitButtonDisabled = (star, createdReview) => {
        setSubmitButtonDisabled(!(star >= 1 && createdReview.length >= 10));
    }

    return (
        <div>
            <form onSubmit={handleSubmit} id='form-review'>
                <h2>How was your stay?</h2>
                <div>
                    {message && <div className="error">{message}</div>}
                </div>
                <textarea
                    placeholder="Leave your review here..."
                    type="text"
                    name="review"
                    value={review}
                    onChange={handleReviewChange}
                />
                {errors.review && <div className="error">{errors.review}</div>}
                <p className="star-container">
                    <StarRatingInput
                        rating={stars}
                        onChange={(starValue) => {
                            setStars(starValue);
                            updateSubmitButtonDisabled(starValue, review);
                        }}
                    />
                    <span> Stars</span>
                </p>
                {errors.stars && <div className="error">{errors.stars}</div>}
                <button id="submit-review-btn" type="submit" disabled={submitButtonDisabled}>
                    Submit your Review
                </button>
            </form>
        </div>
    );
}

// import React, { useState } from 'react';
// import { useDispatch } from 'react-redux';
// import { useModal } from '../../../context/Modal';
// import { createReviewThunk } from '../../../store/reviews';
// // import StarRating from "../../StarRating"
// // import StarRating from "../..StarRating"

// import './CreateReviewModal.css';
// // frontend/src/components/StarRating
// // frontend/src/components/StarRating/StarRating.js
// // frontend/src/components/Reviews/ReviewModals/CreateReviewModal.js

// export default function CreateReviewModal({ spotId, setReloadPage }) {
//   const dispatch = useDispatch();
//   const { closeModal } = useModal();
//   const [stars, setStars] = useState(0);
//   const [review, setReview] = useState('');

//   const [submitButtonDisabled, setSubmitButtonDisabled] = useState(true);
//   const [errors, setErrors] = useState({});
//   const [message, setMessage] = useState('');

//   const handelCreateReview = () => {
//     dispatch(createReviewThunk(spotId, review, stars))
//       .then(() => {
//         closeModal();
//       })
//       .catch(async (error) => {
//         const data = await error.json();
//         if (data && data.errors) {
//           setErrors(data.errors);
//         } else {
//           setMessage(data.message);
//         }
//       });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setErrors({});
//     setMessage('');
//   };

//   const handleStarClick = (starValue) => {
//     setStars(starValue);
//     updateSubmitButtonDisabled(starValue, review);
//   };

//   const handleReviewChange = (e) => {
//     const newReview = e.target.value;
//     setReview(newReview);
//     updateSubmitButtonDisabled(stars, newReview);
//   };

//   const updateSubmitButtonDisabled = (star, createdReview) => {
//     setSubmitButtonDisabled(!(star >= 1 && createdReview.length >= 10));
//   };

//   return (
//     <div>
//       <form onSubmit={handleSubmit} id="form-review">
//         <h2>How was your stay?</h2>
//         <div>
//           {message && <div className="error">{message}</div>}
//         </div>
//         <textarea
//           placeholder="Leave your review here..."
//           type="text"
//           name="review"
//           value={review}
//           onChange={handleReviewChange}
//         />
//         {errors.review && <div className="error">{errors.review}</div>}

//         <StarRating
//           rating={stars}
//           disabled={false}
//           onRatingChange={handleStarClick}
//         />

//         {errors.stars && <div className="error">{errors.stars}</div>}
//         <button id="submit-review-btn" onClick={handelCreateReview} disabled={submitButtonDisabled}>
//           Submit your Review
//         </button>
//       </form>
//     </div>
//   );
// }
