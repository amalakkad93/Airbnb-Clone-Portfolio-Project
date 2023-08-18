import React from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../../context/Modal';
import { deleteReviewThunk } from '../../../store/reviews';
import { getAllReviewsOfCurrentUser } from '../../../store/reviews';
import './DeleteReviewModal.css'


function DeleteReviewModal({ reviewId }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  // const deleteReviewCallBack = async () => {
  //   await dispatch(deleteReviewThunk(reviewId));
  //   await dispatch(getAllReviewsOfCurrentUser());
  //   closeModal();
  // };
  const deleteReviewCallBack = () => dispatch(deleteReviewThunk(reviewId)).then(() => closeModal()).catch((error) =>console.error('Error:', error));


  return (
    <>
      <div className='tile-parent1'>
        <h1>Confirm Delete</h1>
        <p>Are you sure you want to delete this review?</p>
        {/* <button onClick={deleteReviewCallBack}>Delete</button>
        <button onClick={closeModal}>Cancel</button> */}
        <div className="modal__buttons">
          <button className='delete-btn' onClick={deleteReviewCallBack}>Yes (Delete Review)</button>
          <button className='cancel-btn' onClick={closeModal}>No (Keep Review)</button>
        </div>
      </div>
    </>
  );
}

export default DeleteReviewModal;
