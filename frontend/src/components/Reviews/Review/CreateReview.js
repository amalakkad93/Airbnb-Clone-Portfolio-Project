import { getAllReviewsThunk, createReview } from "../../../store/reviews";
import CreateReviewModal from "../ReviewModals/CreateReviewModal";

const CreateReview = ({ spotId, closeForm }) => {

  return (
    <CreateReviewModal
      // review={review}
      formType="Submit Review"
      onSubmit={createReview}
      closeForm={closeForm}
    />
  );
}

export default CreateReview;
