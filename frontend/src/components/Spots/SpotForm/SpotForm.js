import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  createSpotThunk,
  getSpotDetailThunk,
  updateSpotThunk,
} from "../../../store/spots";

import { GetCountries, GetState, GetCity } from "react-country-state-city";

// import FormError from "./FormError";

import TextInput from "../../Inputs/TextInput";
import { LabeledInput } from "../../Inputs/LabeledInput";
import { LabeledTextarea } from "../../Inputs/LabeledTextarea";
import SelectInput from "../../Inputs/SelectInput";

// import { Select } from 'antd';
// import 'antd/dist/antd.css';

import "./SpotForm.css";

export default function SpotForm({ formType, spotId }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [address, setAddress] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [countriesList, setCountriesList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [lat, setLat] = useState(1);
  const [lng, setLng] = useState(1);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [previewImage, setPreviewImage] = useState("");
  const [imageUrl2, setImageUrl2] = useState("");
  const [imageUrl3, setImageUrl3] = useState("");
  const [imageUrl4, setImageUrl4] = useState("");
  const [imageUrl5, setImageUrl5] = useState("");
  const [validationObj, setValidationObj] = useState({});

  const [initialSpot, setInitialSpot] = useState({});

  const [selectActive, setSelectActive] = useState(false);

  const sessionUser = useSelector((stateid) => stateid.session.user);

  // ***************useEffects***************
  useEffect(() => {
    GetCountries().then((result) => setCountriesList(result));
    if (formType === "Edit" && spotId) {
      dispatch(getSpotDetailThunk(spotId)).then((data) => {
        setAddress(data.address);
        setLat(data.lat);
        setLng(data.lng);
        setName(data.name);
        setDescription(data.description);
        setPrice(data.price);
        setCountry(data.country);
        setState(data.state);
        setCity(data.city);

        GetState(data.country).then((states) => setStateList(states));
        GetCity(data.country, data.state).then((cities) => setCityList(cities));
        setInitialSpot(data);
      });
    }
  }, [dispatch, formType, spotId]);

  // =========================================

  useEffect(() => {
    if (country) {
      GetState(country)
        .then((states) => setStateList(states))
        .catch((err) => {
          console.error("Error fetching states:", err);
        });
    }
  }, [country]);
  // =========================================

  useEffect(() => {
    if (state) {
      GetCity(country, state)
        .then((cities) => setCityList(cities))
        .catch((err) => {
          console.error("Error fetching cities:", err);
        });
    }
  }, [state]);
  // =========================================

  // ******************************************

  // *************clearValidationError ************
  // const clearValidationError = (fieldName) => {
  //   if (validationObj[fieldName]) {
  //     setValidationObj(prevState => {
  //       const newState = { ...prevState };
  //       delete newState[fieldName];
  //       return newState;
  //     });
  //   }
  // };

  // const clearValidationError = (validationField) => {
  //   setValidationObj((prev) => ({ ...prev, [validationField]: null }));
  // };

  const clearValidationError = (validationField) => {
    setValidationObj((prev) => {
      const newObj = { ...prev };
      delete newObj[validationField];
      return newObj;
    });
  };

  // ****************************************

  // ******************validateCommonFields**********************
  const validateCommonFields = () => {
    const errors = {};

    if (!address) errors.address = "Address is required";
    if (!country) errors.country = "Country is required";
    if (!city) errors.city = "City is required";
    if (!state) errors.state = "State is required";
    // if (!lat) errors.lat = "Latitude is required";
    // if (!lng) errors.lng = "Longitude is required";
    if (!name) errors.name = "Name is required";
    if (description.length < 30) errors.description = "Description needs a minimum of 30 characters";
    if (!price) errors.price = "Price is required";

    return errors;
  };
  // ****************************************

  // **********handleImages******************
  const handleImages = () => {
    const imageUrls = [
      previewImage,
      imageUrl2,
      imageUrl3,
      imageUrl4,
      imageUrl5,
    ];
    const imageExtensionsRegex = /\.(png|jpe?g)$/i;
    const invalidImages = imageUrls.filter(
      (url) => url && !imageExtensionsRegex.test(url)
    );

    if (invalidImages.length > 0) {
      const errorsObj = { ...validationObj };
      invalidImages.forEach((url, index) => {
        const fieldName = index === 0 ? "previewImage" : `imageUrl${index + 1}`;
        errorsObj[fieldName] = "Image URL must end in .png, .jpg, or .jpeg";
      });
      setValidationObj(errorsObj);
      return false;
    }

    let newSpotImage = [];
    const tempNewSpotImage = [
      { url: previewImage, preview: true },
      { url: imageUrl2, preview: false },
      { url: imageUrl3, preview: false },
      { url: imageUrl4, preview: false },
      { url: imageUrl5, preview: false },
    ];

    tempNewSpotImage.forEach((image) => image.url && newSpotImage.push(image));

    return newSpotImage;
  };
  // ****************************************

  // **********handleInputChange******************
  const handleInputChange = (setterFunction, validationField) => (e) => {
    setterFunction(e.target.value);
    clearValidationError(validationField);
  };
  // ****************************************

  // **********handleCountryChange******************
  const handleCountryChange = (e) => {
    const selectedCountryId = e.target.value;
    setCountry(Number(selectedCountryId));
    clearValidationError("country");
    setState(null);
    setCity(null);
    GetState(selectedCountryId)
      .then((states) => setStateList(states))
      .catch((error) => {
        console.error("Error fetching states:", error);
      });
  };
  // ****************************************

  // **********handleCityChange******************
  const handleCityChange = (e) => {
    const selectedCityId = e.target.value;
    setCity(Number(selectedCityId));
    clearValidationError("city");
  };
  // ****************************************

  // **********handleStateChange******************
  const handleStateChange = (e) => {
    const selectedStateId = e.target.value;
    setState(Number(selectedStateId));
    clearValidationError("state");
    setCity(null);
    GetCity(country, selectedStateId)
      .then((cities) => setCityList(cities.name))
      .catch((error) => {
        console.error("Error fetching cities:", error);
      });
  };
  // ****************************************

  const handleSubmit = async (e) => {
    e.preventDefault();

    let errorsObj = validateCommonFields();
    if (formType === "Create" && !previewImage)
      errorsObj.previewImage = "Preview Image is required";

    if (Object.keys(errorsObj).length) {
      setValidationObj(errorsObj);
      return;
    }

    const newSpotImage = handleImages();
    if (!newSpotImage) return;

    const getNameById = (list, id) =>
      list?.find((item) => item.id === id)?.name || "";
    const spot = {
      address,
      city: getNameById(cityList, city),
      state: getNameById(stateList, state),
      country: getNameById(countriesList, country),
      lat,
      lng,
      name,
      description,
      price,
    };

    try {
      if (formType === "Create") {
        const newlyCreateSpot = await dispatch(
          createSpotThunk(spot, newSpotImage, sessionUser)
        );

        if (newlyCreateSpot.id) navigate(`/spots/${newlyCreateSpot.id}`);
        else throw new Error("Failed to create spot");
      }
      if (formType === "Edit") {
        const updatedSpot = {
          ...initialSpot,
          address,
          city: getNameById(cityList, city) || initialSpot.city,
          state: getNameById(stateList, state) || initialSpot.state,
          country: getNameById(countriesList, country) || initialSpot.country,
          lat,
          lng,
          name,
          description,
          price,
        };
        const updatedSpotData = await dispatch(updateSpotThunk(updatedSpot));
        if (updatedSpotData) navigate(`/spots/${updatedSpotData.id}`);
        else return null;
      }
    } catch (error) {
      console.error("Error processing the spot:", error.message);
    }
  };

  console.log("validationObj:    ", validationObj);
  // ****************************************
  return (
    <div className="form-container">
      <form
        className={
          formType === "Create" ? "create-container" : "edit-container"
        }
        onSubmit={handleSubmit}
      >
        <h1 className="form-header-h1">
          {formType === "Create" ? "Create a new Spot" : "Update your Spot"}
        </h1>
        <div className="form-div-container">
          {/* <h1 className="form-header-h1">
            {formType === "Create" ? "Create a new Spot" : "Update your Spot"}
          </h1> */}

          {/* ***************************Country*************************************** */}
          <div className="box-style location-main-container">
            <div className="form-h2-h3-div">
              <h2 className="form-h2">Where's your place located?</h2>
              <h3 className="form-h3">
                Guests will only get your exact address once they booked a
                reservation.
              </h3>
            </div>

            {/* <div className="error-container"> <p>State</p>{validationObj.stateid && (<p className="errors">{validationObj.stateid}</p>)}</div> */}

            <LabeledInput title="Country" error={validationObj.country}>
              <SelectInput
                value={country}
                options={countriesList}
                placeholder={formType === "Edit" ? country : "Select a Country"}
                onChange={handleCountryChange}
              />
            </LabeledInput>
            {/* ****************************Address************************************ */}

            {/* <div className="error-container"><p>Street Address</p>{validationObj.address && (<p className="errors">{validationObj.address}</p>)}</div> */}
            <LabeledInput title="Street Address" error={validationObj.address}>
              <TextInput
                id="address"
                label="Street Address"
                value={address}
                error={validationObj.address}
                placeholder="Address"
                onChange={handleInputChange(setAddress, "address")}
              />
            </LabeledInput>

            {/* *****************************City and State*********************************** */}
            <div className="city-state-container">
              {/* ***************************City*************************************** */}
              {/* <div className="error-container"><p>city</p>{validationObj.cityid && (<p className="errors">{validationObj.cityid}</p>)}</div> */}
              <LabeledInput title="City" error={validationObj.city}>
                <SelectInput
                  value={city}
                  options={cityList}
                  placeholder={formType === "Edit" ? city : "Select a City"}
                  disabled={!country || !state}
                  onChange={handleCityChange}
                />
              </LabeledInput>
              {/* ***************************State*************************************** */}
              {/* <div className="error-container"><p>State</p>{validationObj.stateid && (<p className="errors">{validationObj.stateid}</p>)}</div> */}
              <LabeledInput title="State" error={validationObj.state}>
                <SelectInput
                  value={state}
                  options={stateList}
                  placeholder={formType === "Edit" ? state : "Select a State"}
                  disabled={!country}
                  onChange={handleStateChange}
                />
              </LabeledInput>
            </div>
            {/* ****************************latitude and Longitude************************************ */}

            {/* <div className="lat-lng-container"> */}
              {/* ***************************latitude*************************************** */}
              {/* <LabeledInput title="Latitude" error={validationObj.lat}> */}
                {/* <TextInput
                  type="number"
                  id="lat"
                  value={lat}
                  placeholder="latitude"
                  onChange={handleInputChange(setLat, "lat")}
                />
              </LabeledInput> */}

              {/* ***************************Longitude*************************************** */}
              {/* <div className="error-container"><p>Longitude</p>{validationObj.lng && (<p className="errors">{validationObj.lng}</p>)}</div> */}
              {/* <LabeledInput title="Longitude" error={validationObj.lng}>
                <TextInput
                  type="number"
                  id="lng"
                  value={lng}
                  placeholder="Longitude"
                  onChange={handleInputChange(setLng, "lng")}
                />
              </LabeledInput> */}
            {/* </div> */}
            <hr></hr>
            {/* ****************************description************************************ */}
            <div
              className={
                formType === "Create"
                  ? "create-description-textarea"
                  : "edit-description-textarea"
              }
            >
              <div className="form-h2-h3-div">
                <h2 className="form-h2">Describe your place to guests</h2>
                <h3 className="form-h3">
                  Mention the best features of your space, any special
                  amentities like fast wif or parking, and what you love about
                  the neighborhood.
                </h3>
              </div>
              <LabeledTextarea>
                <textarea
                  id="description"
                  placeholder="Description"
                  value={description}
                  onChange={handleInputChange(setDescription, "description")}
                  className={formType === "Edit" ? "edit-form-textarea" : ""}
                />
              </LabeledTextarea>
              <div className="error-container">{validationObj.description && (<p className="errors">{validationObj.description}</p>)}</div>
            </div>
            <hr></hr>
            {/* ****************************Name************************************ */}
            <div className="form-h2-h3-div">
              <h2 className="form-h2">Create a title for your spot</h2>
              <h3 className="form-h3">
                Catch guests' attention with a spot title that highlights what
                makes your place special.
              </h3>
            </div>
            <LabeledInput>
              <TextInput
                type="text"
                id="name"
                value={name}
                placeholder="Name of your spot"
                onChange={handleInputChange(setName, "name")}
              />
            </LabeledInput>
            {validationObj.name && <p className="errors">{validationObj.name}</p>}
            <hr></hr>
            {/* ****************************Price************************************ */}
            <div className="form-h2-h3-div">
              <h2 className="form-h2">Set a base price for your spot</h2>
              <h3 className="form-h3">
                Competitive pricing can help your listing stand out and rank
                higher in search results.
              </h3>
            </div>
            <LabeledInput>
              <TextInput
                type="number"
                id="price"
                value={price}
                placeholder="Price per night (USD)"
                onChange={handleInputChange(setPrice, "price")}
              />
            </LabeledInput>
            {validationObj.price && (<p className="errors">{validationObj.price}</p>)}
            <hr></hr>
            {/* ****************************Images************************************ */}
            {formType === "Create" && (
              <>
                <div className="form-h2-h3-div">
                  <h2 className="form-h2">Liven up your spot with photos</h2>
                  <h3 className="form-h3">
                    Submit a link to at least one photo to publish your spot.
                  </h3>
                </div>

                {/* ****************************previewImage************************************ */}

                <LabeledInput>
                  <TextInput
                    id="previewImage"
                    placeholder="Preview Image URL"
                    value={previewImage}
                    onChange={handleInputChange(
                      setPreviewImage,
                      "previewImage"
                    )}
                    type="url"
                  />
                </LabeledInput>
                {validationObj.previewImage && ( <p className="errors">{validationObj.previewImage}</p>)}

                {/* ****************************imageUrl2************************************ */}
                <LabeledInput>
                  <TextInput
                    id="imageUrl2"
                    placeholder="Image URL"
                    value={imageUrl2}
                    onChange={handleInputChange(setImageUrl2, "imageUrl2")}
                    type="url"
                  />
                </LabeledInput>
                {validationObj.imageUrl2 && <p className="errors">{validationObj.imageUrl2}</p>}

                {/* ****************************imageUrl3************************************ */}
                <LabeledInput>
                  <TextInput
                    id="imageUrl3"
                    placeholder="Image URL"
                    value={imageUrl3}
                    onChange={handleInputChange(setImageUrl3, "imageUrl3")}
                    type="url"
                  />
                </LabeledInput>
                {validationObj.imageUrl3 && <p className="errors">{validationObj.imageUrl3}</p>}

                {/* ****************************imageUrl4************************************ */}
                <LabeledInput>
                  <TextInput
                    id="imageUrl4"
                    placeholder="Image URL"
                    value={imageUrl4}
                    onChange={handleInputChange(setImageUrl4, "imageUrl4")}
                    type="url"
                  />
                </LabeledInput>
                {validationObj.imageUrl4 && <p className="errors">{validationObj.imageUrl4}</p>}

                {/* ****************************imageUrl5************************************ */}
                <LabeledInput>
                  <TextInput
                    id="imageUrl5"
                    placeholder="Image URL"
                    value={imageUrl5}
                    onChange={handleInputChange(setImageUrl5, "imageUrl5")}
                    type="url"
                  />
                </LabeledInput>
                {validationObj.imageUrl5 && <p className="errors">{validationObj.imageUrl5}</p>}
                <hr></hr>
              </>
            )}
          </div>

          {/* <div className='button-form-div'> */}
          <button
            className="spot-form-btn"
            type="submit"
            disabled={Object.keys(validationObj).length > 0}
          >
            {formType === "Create" ? "Create Spot" : "Update Spot"}
          </button>
          {/* </div> */}
        </div>
      </form>
    </div>
  );
}
