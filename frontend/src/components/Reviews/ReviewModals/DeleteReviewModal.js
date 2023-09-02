import React from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../../context/Modal';
import { deleteReviewThunk } from '../../../store/reviews';
import { getAllReviewsThunk } from '../../../store/reviews';
import './DeleteReviewModal.css'


export default function DeleteReviewModal({ reviewId, spotId, setReloadPage}) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  console.log("reviewId: ", reviewId)
  // const deleteReviewCallBack = async () => {
  //   await dispatch(deleteReviewThunk(reviewId));
  //   await dispatch(getAllReviewsOfCurrentUser());
  //   closeModal();
  // };
  const handleDelete = async () => {
    try {
      await dispatch(deleteReviewThunk(reviewId));
      await dispatch(getAllReviewsThunk(spotId));
      closeModal();
      setReloadPage(prevState => !prevState);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <>
      <div className='tile-parent-delete-review'>
        <div className="delete-review-h1-p-tag">
          <h1 className="delete-review-h1-tag">Confirm Delete</h1>
          <p className="delete-review-p-tag">Are you sure you want to delete this review?</p>
        </div>
        <div className="delete-keep-review-cancel-btn">
          <button id="delete-review-btn" onClick={handleDelete}>Yes (Delete Review)</button>
          <button id="delete-review-btn" onClick={closeModal}>No (Keep Review)</button>
        </div>
        {/* <div className="modal__buttons">
          <button className='delete-btn' onClick={deleteReviewCallBack}>Yes (Delete Review)</button>
          <button className='cancel-btn' onClick={closeModal}>No (Keep Review)</button>
        </div> */}
      </div>
    </>
  );
}
