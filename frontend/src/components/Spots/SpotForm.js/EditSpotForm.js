import { useParams } from "react-router-dom";
import SpotForm from "./SpotForm";

export default function EditSpotForm() {

  const { spotId } = useParams();
  return (
    <>
    <SpotForm
      formType="Edit"
      spotId={spotId}
    />
    </>
    );
}
