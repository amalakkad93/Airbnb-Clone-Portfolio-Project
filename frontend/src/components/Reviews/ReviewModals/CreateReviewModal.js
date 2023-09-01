import React, { useState, useEffect } from 'react';
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

    useEffect(() => {
        setSubmitButtonDisabled(!(stars >= 1 && review.length >= 10));
    }, [stars, review]);

    // const handleCreateReview = async () => {
    //     try {
    //         await dispatch(createReviewThunk(spotId, review, stars));
    //         closeModal();
    //         setReloadPage(prevState => !prevState);
    //     } catch (error) {
    //         const data = await error.json();
    //         if (data && data.errors) setErrors(data.errors);
    //         else setMessage(data.message);
    //     }
    // }

    // const handleSubmit = (e) => {
    //     e.preventDefault();
    //     handleCreateReview();
    // }
        // const handleReviewChange = (e) => {
        // setReview(e.target.value);
    // };
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await dispatch(createReviewThunk(spotId, review, stars));
            closeModal();
            setReloadPage(prevState => !prevState);
        } catch (error) {
            const data = await error.json();
            if (data && data.errors) {
                setErrors(data.errors);
            } else {
                setMessage(data.message);
            }
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit} id='form-review'>
                <h2 className="review-form-h2">How was your stay?</h2>
                <div>
                    {message && <div className="error">{message}</div>}
                </div>
                <textarea
                    placeholder="Leave your review here..."
                    type="text"
                    name="review"
                    value={review}
                    // onChange={handleReviewChange}
                    onChange={(e) => setReview(e.target.value)}
                />
                {errors.review && <div className="error">{errors.review}</div>}
                <p className="star-container">
                    <StarRatingInput
                        rating={stars}
                        onChange={(starValue) => {
                            setStars(starValue);
                        }}
                    />
                    <span> Stars</span>
                </p>
                {errors.stars && <div className="error">{errors.stars}</div>}
                <button id="review-btn" type="submit" disabled={submitButtonDisabled}>
                    Submit your Review
                </button>
            </form>
        </div>
    );
}

// import React, { useState, useEffect } from 'react';
// import { useDispatch } from 'react-redux';
// import { useModal } from '../../../context/Modal';
// import { createReviewThunk } from '../../../store/reviews';
// import StarRatingInput from '../../StarRatingInput/StarRatingInput';
// import './CreateReviewModal.css';

// export default function CreateReviewModal({ spotId, setReloadPage }) {
//     const dispatch = useDispatch();
//     const { closeModal } = useModal();
//     const [stars, setStars] = useState(0);
//     const [review, setReview] = useState('');

//     const [submitButtonDisabled, setSubmitButtonDisabled] = useState(true);
//     const [errors, setErrors] = useState({});
//     const [message, setMessage] = useState('');


//     const handleCreateReview = async () => {
//         try {
//             await dispatch(createReviewThunk(spotId, review, stars));
//             closeModal();
//             setReloadPage(prevState => !prevState);
//         } catch (error) {
//             const data = await error.json();
//             if (data && data.errors) setErrors(data.errors);
//             else setMessage(data.message);
//         }
//     }

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         handleCreateReview();
//     }

//     const handleReviewChange = (e) => {
//         const reviewText = e.target.value;
//         setReview(reviewText);
//         updateSubmitButtonDisabled(stars, reviewText);
//     };

//     const updateSubmitButtonDisabled = (star, createdReview) => {
//         setSubmitButtonDisabled(!(star >= 1 && createdReview.length >= 10));
//     }


//     return (
//         <div>
//             <form onSubmit={handleSubmit} id='form-review'>
//                 <h2 className="review-form-h2">How was your stay?</h2>
//                 <div>
//                     {message && <div className="error">{message}</div>}
//                 </div>
//                 <textarea
//                     placeholder="Leave your review here..."
//                     type="text"
//                     name="review"
//                     value={review}
//                     onChange={handleReviewChange}
//                 />
//                 {errors.review && <div className="error">{errors.review}</div>}
//                 <p className="star-container">
//                     <StarRatingInput
//                         rating={stars}
//                         onChange={(starValue) => {
//                             setStars(starValue);
//                             updateSubmitButtonDisabled(starValue, review);
//                         }}
//                     />
//                     <span> Stars</span>
//                 </p>
//                 {errors.stars && <div className="error">{errors.stars}</div>}
//                 <button id="submit-review-btn" type="submit" disabled={submitButtonDisabled}>
//                     Submit your Review
//                 </button>
//             </form>
//         </div>
//     );
// }
