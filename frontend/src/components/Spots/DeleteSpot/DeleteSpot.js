import { useDispatch } from "react-redux";
import { useModal } from "../../../context/Modal";
import {deleteSpotThunk } from "../../../store/spots";
import { getOwnerAllSpotsThunk } from "../../../store/spots";



function DeleteSpot({spotId}) {
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
  const deleteSpotCallBack = async () => {
     await dispatch(deleteSpotThunk(spotId));
     await dispatch(getOwnerAllSpotsThunk());
      closeModal();
  }

  return (
    <>
        <div>
          <h1>Confirm Delete</h1>
          <p>This action cannot be undone.</p>
        <button onClick={deleteSpotCallBack}>Delete</button>
        <button onClick={closeModal}>Cancel</button>
        </div>
    </>
  );
}

export default DeleteSpot;
