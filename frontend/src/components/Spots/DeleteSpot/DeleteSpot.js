import { useDispatch } from "react-redux";
import { useModal } from "../../../context/Modal";
import {deleteSpotThunk } from "../../../store/spots";
import { getOwnerAllSpotsThunk } from "../../../store/spots";
import './DeleteSpot.css'



export default function DeleteSpot({spotId}) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  // const handleSubmit = (e) => {
  //   e.preventDefault();

  //   return dispatch(deleteSpotThunk(spotId))
  //     .then(closeModal)
  //     .catch(async (res) => {
  //       const data = await res.json();
  //       if (data && data.errors) {
  //         setErrors(data.errors);
  //       }
  //     });
  // };
  const handleDelete = async () => {
     await dispatch(deleteSpotThunk(spotId));
     await dispatch(getOwnerAllSpotsThunk());
     closeModal();
  }

  return (
    <>
      <div className='tile-parent-delete-spot'>
        <div className="delete-spot-h1-p-tag">
          <h1 className="delete-spot-h1-tag">Confirm Delete</h1>
          <p className="delete-spot-p-tag">Are you sure you want to delete this spot from the listings?</p>
        </div>
        <div className="delete-keep-spot-btn">
          <button id="delete-spot-btn" onClick={handleDelete}>Yes (Delete Spot)</button>
          <button id="delete-spot-btn" onClick={closeModal}>No (Keep Spot)</button>
        </div>
        {/* <div className="modal__buttons">
          <button className='delete-btn' onClick={deleteReviewCallBack}>Yes (Delete Review)</button>
          <button className='cancel-btn' onClick={closeModal}>No (Keep Review)</button>
        </div> */}
      </div>
    </>
  );
}
