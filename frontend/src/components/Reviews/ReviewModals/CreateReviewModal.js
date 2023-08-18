
import ReviewForm from './ReviewForm';
import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useModal} from '../../../context/Modal';
import {createReviewThunk, getSingleReview } from '../../../store/reviews';
import OpenModalButton from "../../OpenModalButton";
// import StarsRatingInput from '../GetAllReviews/StarsRatingInput';
import './CreateReviewModal.css';


export default function  CreateReviewModal({ spotId, setReloadPage}){
    const dispatch = useDispatch();
    const { closeModal } = useModal();
    const [stars, setStars] = useState(0);
    const [review, setReview] = useState('');

    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(true);
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');

    const handelCreateReview = () => {
        dispatch(createReviewThunk(spotId, review, stars))
            .then(() => {
                closeModal();
            })
            .catch(async (error) => {
                const data = await error.json();
                if (data && data.errors) {
                    setErrors(data.errors);
                } else {
                    setMessage(data.message);
                }
            });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setMessage('');
    }

    const handleStarClick = (starValue) => {
        setStars(starValue);
        updateSubmitButtonDisabled(starValue, review);
    };

    const handleReviewChange = (e) => {
        const review = e.target.value;
        setReview(e.target.value);
        updateSubmitButtonDisabled(stars, review);
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
                    {[1, 2, 3, 4, 5].map((star) => (
                        <span  key={star} onClick={() => handleStarClick(star)}>☆</span>

                    ))}<span>Stars</span>
                </p>
                {errors.stars && <div className="error">{errors.stars}</div>}
                <button id="submit-review-btn" onClick={handelCreateReview} disabled={submitButtonDisabled} >Submit your Review</button>
            </form>
        </div>
    );
}




