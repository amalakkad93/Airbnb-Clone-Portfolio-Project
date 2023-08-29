import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import {createSpotThunk, getSpotDetailThunk, updateSpotThunk } from '../../../store/spots';

import { GetCountries, GetState, GetCity } from 'react-country-state-city';
// import { Select } from 'antd';
// import 'antd/dist/antd.css';

import './SpotForm.css';

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
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState('');
  const [previewImage, setPreviewImage] = useState("");
  const [imageUrl2, setImageUrl2] = useState("");
  const [imageUrl3, setImageUrl3] = useState("");
  const [imageUrl4, setImageUrl4] = useState("");
  const [imageUrl5, setImageUrl5] = useState("");
  const [validationObj, setValidationObj] = useState({});

  const [initialSpot, setInitialSpot] = useState({});

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
        GetState(country).then((states) => setStateList(states)).catch(error => {console.error("Error fetching states:", error)});
    }
}, [country]);
// =========================================

useEffect(() => {
    if (state) {
        GetCity(country, state).then((cities) => setCityList(cities)).catch(error => {console.error("Error fetching cities:", error)});
    }
}, [state]);
// =========================================

// ******************************************

  // *************clearValidationError ************
  const clearValidationError = (fieldName) => {
    if (validationObj[fieldName]) {
      setValidationObj(prevState => {
        const newState = { ...prevState };
        delete newState[fieldName];
        return newState;
      });
    }
  };

  // ****************************************

  // ******************validateCommonFields**********************
  const validateCommonFields = () => {
    const errors = {};

    if (!address) errors.address = "Address is required";
    if (!city) errors.cityid = "City is required";
    if (!state) errors.stateid = "State is required";
    if (!country) errors.countryid = "Country is required";
    if (!lat) errors.lat = "Latitude is required";
    if (!lng) errors.lng = "Longitude is required";
    if (!name) errors.name = "Name is required";
    if (!description) errors.description = "Description is required";
    if (!price) errors.price = "Price is required";

    return errors;
  };
// ****************************************

  // **********handleImages******************
  const handleImages = () => {
    const imageUrls = [previewImage, imageUrl2, imageUrl3, imageUrl4, imageUrl5];
    const imageExtensionsRegex = /\.(png|jpe?g)$/i;
    const invalidImages = imageUrls.filter((url) => url && !imageExtensionsRegex.test(url));

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
  const handleInputChange = (setterFunction, validationField) => e => {
    setterFunction(e.target.value);
    clearValidationError(validationField);
  };
 // ****************************************

  // **********handleSubmit******************
  const handleSubmit = async (e) => {
    e.preventDefault();

    let errorsObj = validateCommonFields();
    if (formType === "Create"  && !previewImage) errorsObj.previewImage = "Preview Image is required";

    if (Object.keys(errorsObj).length) {
      setValidationObj(errorsObj);
      return;
    }

    const newSpotImage = handleImages();
    if (!newSpotImage) return;

    const getNameById = (list, id) => list?.find(item => item.id === id)?.name || '';
    const spot = {
      address,
      city: getNameById(cityList, city),
      state: getNameById(stateList, state),
      country: getNameById(countriesList, country),
      lat, lng, name, description, price
    };

    try {
      if (formType === "Create") {
        const newlyCreateSpot = await dispatch(createSpotThunk(spot, newSpotImage, sessionUser));
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
          lat, lng, name, description, price
        };
        const updatedSpotData = await dispatch(updateSpotThunk(updatedSpot));
        if (updatedSpotData) navigate(`/spots/${updatedSpotData.id}`);
        else return null;
      }
    } catch (error) {
      console.error("Error processing the spot:", error.message);
    }
  };
  // ****************************************

  return (
    <div className="form-container">
      <form
        className={
          formType === "Create" ? "create-container" : "edit-container"
        }
        onSubmit={handleSubmit}
      >
        <h1>
          {formType === "Create" ? "Create a new Spot" : "Update your Spot"}
        </h1>
        {/* ***************************countryid*************************************** */}
        <div>
          <div className="div-title">
            <h2>Where is your place located?</h2>
            <p>
              Guests will only get you exact address once they booked a
              reservation.
            </p>
            <div className="error-container">
              <p>Country</p>
              {validationObj.country && (<p className="errors">{validationObj.country}</p>)}
            </div>
          </div>
          <label htmlFor="countryid" className="label"></label>
          {/* <Select> */}
          {/* <div> */}

          {/* <input type="text" placeholder="Select a Country..." readOnly/> */}
          <select
            value={country}
            onChange={(e) => {
              const selectedCountryId = e.target.value;
              setCountry(Number(selectedCountryId));
              console.log("Selected Country ID:", selectedCountryId);
              setState(null);
              setCity(null);
              GetState(selectedCountryId).then(states => setStateList(states)).catch(error => {
                console.error("Error fetching states:", error);
              });
            }}
          >
            {formType === "Edit" ? <option value="">{country}</option> : <option value={null}>Select a Country</option>}
            {countriesList && countriesList.map((country) => (<option key={country.id} value={country.id}>{country.name}</option>))}
          </select>


          {/* </div> */}

          {/* </Select> */}

        </div>
        {/* *****************************cityid and stateid*********************************** */}
        <div className="city-state-container">
          <div className="city-state-input-box">
            {/* ***************************cityid*************************************** */}
            <div className="city">
              <div className="error-container">
                <p>city</p>
                {validationObj.city && (<p className="errors">{validationObj.city}</p>)}
              </div>

              <select
                value={city}
                onChange={(e) => {
                  const selectedCityId = e.target.value;
                  setCity(Number(selectedCityId));
                }}
                disabled={!country || !state}
              >
                {formType === "Edit" ? <option value="">{city}</option> : <option value={null}>Select a City</option>}
                {cityList && cityList.map((city) => (<option key={city.id} value={city.id}>{city.name}</option>))}
              </select>

            </div>
            {/* ***************************stateid*************************************** */}
            <div className="stateid">
              <div className="error-container">
                <p>State</p>
                {validationObj.state && (
                  <p className="errors">{validationObj.state}</p>
                )}
              </div>

              <select
                value={state}
                onChange={(e) => {
                  const selectedStateId = e.target.value;
                  setState(Number(selectedStateId));
                  setCity(null);
                  GetCity(country, selectedStateId).then(cities => setCityList(cities.name)).catch(error => {
                    console.error("Error fetching cities:", error);
                  });
                }}
                disabled={!country}
              >
                {formType === "Edit" ? <option value="">{state}</option> : <option value={null}>Select a State</option>}
                {stateList && stateList.map((state, index) =>(<option key={state.id} value={state.id}>{state.name}</option>))}
              </select>

            </div>
          </div>
        </div>
        {/* **************************************************************** */}

        {/* ****************************Address************************************ */}
        <div className="address">
          <div className="error-container">
            <p>Street Address</p>
            {validationObj.address && (<p className="errors">{validationObj.address}</p>)}
          </div>

          {/* <label htmlFor="Address" className="label"></label> */}
          <input
            type="text"
            id="address"
            placeholder="Address"
            value={address}
            // onChange={(e) => setAddress(e.target.value)}
            onChange={handleInputChange(setAddress, 'address')}
          />
        </div>
        {/* ****************************latitude and Longitude************************************ */}
        <div className="lat-lng-container">
          <div className="lat-lng-input-box">
            {/* ***************************latitude*************************************** */}
            <div className="latitude">
              <div className="error-container">
                <p>latitude</p>
                {validationObj.lat && (
                  <p className="errors">{validationObj.lat}</p>
                )}
              </div>
              <input
                type="number"
                id="lat"
                placeholder="latitude"
                value={lat}
                // onChange={(e) => setLat(e.target.value)}
                onChange={handleInputChange(setLat, 'lat')}
              />
            </div>
            {/* ***************************Longitude*************************************** */}
            <div className="Longitude">
              <div className="error-container">
                <p>Longitude</p>
                {validationObj.lng && (
                  <p className="errors">{validationObj.lng}</p>
                )}
              </div>
              <input
                type="number"
                id="lng"
                placeholder="Longitude"
                value={lng}
                // onChange={(e) => setLng(e.target.value)}
                onChange={handleInputChange(setLng, 'lng')}
              />
            </div>
          </div>
        </div>
        {/* **************************************************************** */}
        <div
          className={
            formType === "Create"
              ? "create-description-textarea"
              : "edit-description-textarea"
          }
        >
          {/* ****************************description************************************ */}
          <div className="div-title">Describe your place to guests</div>
          <label htmlFor="description"></label>
          <p>
            {" "}
            mention the best features of your space, any special amenities like
            fast wifi or parking, and what you love about the neighborhood
          </p>
          <textarea
            type="text"
            id="description"
            placeholder="Please write at least 30 characters"
            value={description}
            // onChange={(e) => setDescription(e.target.value)}
            onChange={handleInputChange(setDescription, 'description')}
            className={formType === "Edit" ? "edit-form-textarea" : ""}
          />
          <div className="error-container">
            {validationObj.description && (<p className="errors">{validationObj.description}</p>)}
          </div>
        </div>
        {/* **************************************************************** */}

        {/* ****************************Name************************************ */}
        <div className="name">
          <div className="div-title">Create a title for your spot</div>

          <label htmlFor="Name" className="label"></label>
          <input
            type="text"
            id="name"
            placeholder="Name of your spot"
            value={name}
            // onChange={(e) => setName(e.target.value)}
            onChange={handleInputChange(setName, 'name')}

          />
          {validationObj.name && <p className="errors">{validationObj.name}</p>}
        </div>
        {/* **************************************************************** */}

        {/* ****************************Price************************************ */}
        <div className="price">
          <div className="div-title">Set a base price for your spot</div>
          <label htmlFor="Price" className="label"></label>
          <div className="price-dollar-sign">
            <div>$</div>
            <input
              type="number"
              id="price"
              placeholder="Price per night (USD)"
              value={price}
              // onChange={(e) => setPrice(e.target.value)}
              onChange={handleInputChange(setPrice, 'price')}
            />
          </div>
          {validationObj.price && (<p className="errors">{validationObj.price}</p>)}
        </div>
        {/* **************************************************************** */}

        {/* ****************************Images************************************ */}

        {formType === "Create" && (
          <div className="form-image-input">
            {/* ****************************previewImage************************************ */}
            <div className="previewImage">
              <label htmlFor="previewImage"></label>
              <input
                type="url"
                id="imageUrl1"
                value={previewImage}
                placeholder="Preview Image URL"
                // onChange={(e) => {
                //   setPreviewImage(e.target.value);
                //   clearImageError("previewImage");
                // }}
                  onChange={handleInputChange(setPreviewImage, 'previewImage')}
              />
              {validationObj.previewImage && (
                <p className="errors">{validationObj.previewImage}</p>
              )}
            </div>
            {/* **************************************************************** */}

            {/* ****************************imageUrl2************************************ */}
            <div className="imageUrl">
              <label htmlFor="imageUrl2"></label>
              <input
                type="url"
                id="imageUrl2"
                value={imageUrl2}
                placeholder="Image URL"
                // onChange={(e) => {
                //   setImageUrl2(e.target.value);
                //   clearImageError("imageUrl2");
                // }}
                onChange={handleInputChange(setImageUrl2, 'imageUrl2')}
              />
              {validationObj.imageUrl2 && <p className="errors">{validationObj.imageUrl2}</p>}
            </div>
            {/* **************************************************************** */}

            {/* ****************************imageUrl3************************************ */}
            <div className="imageUrl">
              <label htmlFor="imageUrl3"></label>
              <input
                type="url"
                id="imageUrl3"
                value={imageUrl3}
                placeholder="Image URL"
                // onChange={(e) => {
                //   setImageUrl3(e.target.value);
                //   clearImageError("imageUrl3");
                // }}
                onChange={handleInputChange(setImageUrl3, 'imageUrl3')}
              />
              {/* {validationObj.imageUrl3 && <p className="errors">{validationObj.imageUrl3}</p>} */}
            </div>
            {/* **************************************************************** */}

            {/* ****************************imageUrl4************************************ */}
            <div className="imageUrl">
              <label htmlFor="imageUrl4"></label>
              <input
                type="url"
                id="imageUrl4"
                value={imageUrl4}
                placeholder="Image URL"
                // onChange={(e) => {
                //   setImageUrl4(e.target.value);
                //   clearImageError("imageUrl4");
                // }}
                onChange={handleInputChange(setImageUrl4, 'imageUrl4')}
              />
              {/* {validationObj.imageUrl4 && <p className="errors">{validationObj.imageUrl4}</p>} */}
            </div>
            {/* **************************************************************** */}

            {/* ****************************imageUrl5************************************ */}
            <div className="imageUrl">
              <label htmlFor="imageUrl5"></label>
              <input
                type="url"
                id="imageUrl5"
                value={imageUrl5}
                placeholder="Image URL"
                // onChange={(e) => {
                //   setImageUrl5(e.target.value);
                //   clearImageError("imageUrl5");
                // }}
                onChange={handleInputChange(setImageUrl5, 'imageUrl5')}
              />
              {/* {validationObj.imageUrl5 && <p className="errors">{validationObj.imageUrl5}</p>} */}
            </div>
          </div>
        )}
        <button
          className="spot-form-btn"
          type="submit"
          disabled={Object.keys(validationObj).length > 0}
        >
          Submit
        </button>
      </form>
    </div>
  );
}
