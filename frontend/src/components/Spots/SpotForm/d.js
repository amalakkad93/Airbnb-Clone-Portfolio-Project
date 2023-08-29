import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import {createSpotThunk, getSpotDetailThunk, updateSpotThunk } from '../../../store/spots';

import { GetCountries, GetState, GetCity } from 'react-country-state-city';

import FormError from './FormError';
import LabeledSelect from './LabeledInput'

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
  const [lat, setLat] = useState(1);
  const [lng, setLng] = useState(1);
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

    // if (!address) errors.address = "Address is required";
    if (!country) errors.country = "Country is required";
    if (!city) errors.city = "City is required";
    if (!state) errors.state = "State is required";
    // if (!lat) errors.lat = "Latitude is required";
    // if (!lng) errors.lng = "Longitude is required";
    // if (!name) errors.name = "Name is required";
    // if (!description) errors.description = "Description is required";
    // if (!price) errors.price = "Price is required";

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
  const placeholderHeight = countriesList.length * 20;
  // ****************************************
  return (
    <div className="form-container">
      <form className={formType === "Create" ? "create-container" : "edit-container"} onSubmit={handleSubmit}>
        <div className="form-div-container">
            <h1 className="form-header-h1">{formType === "Create" ? "Create a new Spot" : "Update your Spot"}</h1>
            {/* ***************************Country*************************************** */}
            <div className="box-style location-main-container">
                  <div className="form-h2-h3-div">
                      <h2 className="form-h2">Where's your place located?</h2>
                      <h3 className="form-h3">Guests will only get your exact address once they booked a reservation.</h3>
                  </div>
                  {/* <label htmlFor="country" className="form-label"> */}
                    <div className="errors-p-tag">
                      <p className="form-p-tag">Country</p>
                      {validationObj.country && (<p className="errors">{validationObj.country}</p>)}
                    </div>
                    <select
                        value={country}
                        className="box-size"
                        onChange={(e) => {
                          const selectedCountryId = e.target.value;
                          setCountry(Number(selectedCountryId));
                          setState(null);
                          setCity(null);
                          GetState(selectedCountryId).then(states => setStateList(states)).catch(error => {
                          console.error("Error fetching states:", error);
                          });
                        }}
                    >
                      {formType === "Edit" ? <option value="">{country}</option> : <option value="">Select a Country</option>}
                      {countriesList && countriesList.map((country) => (<option key={country.id} value={country.id}>{country.name}</option>))}
                    </select>
                  {/* </label> */}
                  {selectActive && <div className="placeholder" style={{ height: `${placeholderHeight}px` }}></div>}
                  {/* ****************************Address************************************ */}

                   {/* <label htmlFor="address" className="form-label"> */}
                    <div className="errors-p-tagg">
                      <p className="form-p-tag">Street Address</p>
                      {validationObj.address && (<p className="errors">{validationObj.address}</p>)}
                    </div>
                    <input
                       type="text"
                       id="address"
                       placeholder="Address"
                       value={address}
                       // onChange={(e) => setAddress(e.target.value)}
                       onChange={handleInputChange(setAddress, 'address')}
                    />
                  {/* </label> */}
                 {/* *****************************City and State*********************************** */}
                 <div className="city-state-container">
                   {/* ***************************City*************************************** */}
                    {/* <label htmlFor="city" className="form-label"> */}
                    {/* <label htmlFor="city" className="form-label"> */}
                       <div className="errors-p-tag">
                         <p className="form-p-tag">City</p>
                         {validationObj.city && (<p className="errors">{validationObj.city}</p>)}
                       </div>
                       <select
                           value={city}
                           className="box-size"
                           onChange={(e) => {
                             const selectedCityId = e.target.value;
                             setCity(Number(selectedCityId));
                           }}
                           disabled={!country || !state}
                       >
                         {formType === "Edit" ? <option value="">{city}</option> : <option value="">Select a City</option>}
                         {cityList && cityList.map((city) => (<option key={city.id} value={city.id}>{city.name}</option>))}
                       </select>
                     {/* </label> */}
                     {selectActive && <div className="placeholder" style={{ height: `${placeholderHeight}px` }}></div>}
                    {/* ***************************State*************************************** */}
                    {/* <label htmlFor="state" className="form-label"> */}
                       <div className="errors-p-tag">
                         <p className="form-p-tag">State</p>
                         {validationObj.state && (<p className="errors">{validationObj.state}</p>)}
                       </div>
                       <select
                           value={state}
                           className="box-size"
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
                     {/* </label> */}
                     {/* {selectActive && <div className="placeholder" style={{ height: `${placeholderHeight}px` }}></div>} */}
                 </div>
                  {/* ****************************latitude and Longitude************************************ */}
                  <div className="lat-lng-container">
                      {/* ***************************latitude*************************************** */}
                      <label htmlFor="lat" className="form-label">
                            <div className="errors-p-tag">
                              <p className="form-p-tag">latitude</p>
                              {validationObj.lat && (<p className="errors">{validationObj.lat}</p>)}
                            </div>
                            <input
                               type="number"
                               id="lat"
                               placeholder="latitude"
                               value={lat}
                               // onChange={(e) => setLat(e.target.value)}
                               onChange={handleInputChange(setLat, 'lat')}
                            />
                      </label>

                       {/* ***************************Longitude*************************************** */}
                      <label htmlFor="lng" className="form-label">
                            <div className="errors-p-tag">
                              <p className="form-p-tag">Longitude</p>
                              {validationObj.lng && (<p className="errors">{validationObj.lng}</p>)}
                            </div>
                            <input
                               type="number"
                               id="lng"
                               placeholder="Longitude"
                               value={lng}
                               // onChange={(e) => setLng(e.target.value)}
                               onChange={handleInputChange(setLng, 'lng')}
                            />
                      </label>

                  </div>
                  <hr></hr>
                  {/* ****************************description************************************ */}
                  <div className={ formType === "Create" ? "create-description-textarea" : "edit-description-textarea"}>
                      <div className="form-h2-h3-div">
                          <h2 className="form-h2">Describe your place to guests</h2>
                          <h3 className="form-h3">Mention the best features of your space, any special amentities like fast wif or parking, and what you love about the neighborhood.</h3>
                      </div>
                      {/* <label htmlFor="description" className="form-label"> */}
                            <textarea
                                type="text"
                                id="description"
                                placeholder="Please write at least 30 characters"
                                value={description}
                                // onChange={(e) => setDescription(e.target.value)}
                                onChange={handleInputChange(setDescription, 'description')}
                                className={formType === "Edit" ? "edit-form-textarea" : ""}
                            />
                            <div className="errors-p-tag">
                                  <p className="form-p-tag">Longitude</p>
                                  {validationObj.description && (<p className="errors">{validationObj.description}</p>)}
                            </div>
                      {/* </label> */}
                  </div>
                  <hr></hr>
                   {/* ****************************Name************************************ */}
                   <div className="form-h2-h3-div">
                       <h2 className="form-h2">Create a title for your spot</h2>
                       <h3 className="form-h3">Catch guests' attention with a spot title that highlights what makes your place special.</h3>
                   </div>
                   <label htmlFor="name" className="form-label">
                      <input
                         type="text"
                         id="name"
                         placeholder="Name of your spot"
                         value={name}
                         // onChange={(e) => setName(e.target.value)}
                         onChange={handleInputChange( setName, 'name')}
                      />
                      <div className="errors-p-tagg">
                            {validationObj.name && <p className="errors">{validationObj.name}</p>}
                      </div>
                  </label>
                  <hr></hr>
                   {/* ****************************Price************************************ */}
                   <div className="form-h2-h3-div">
                       <h2 className="form-h2">Set a base price for your spot</h2>
                       <h3 className="form-h3">Competitive pricing can help your listing stand out and rank higher in search results.</h3>
                   </div>
                   <label htmlFor="price" className="form-label">
                      <input
                         type="number"
                         id="price"
                         placeholder="Price per night (USD)"
                         value={price}
                         // onChange={(e) => setPrice(e.target.value)}
                         onChange={handleInputChange(setPrice, 'price')}
                      />
                      <div className="errors-p-tagg">
                          {validationObj.price && (<p className="errors">{validationObj.price}</p>)}
                      </div>
                  </label>
                  <hr></hr>
                   {/* ****************************Images************************************ */}
                   {formType === "Create" && (
                    <>
                    <div className="form-h2-h3-div">
                          <h2 className="form-h2">Liven up your spot with photos</h2>
                          <h3 className="form-h3">Submit a link to at least one photo to publish your spot.</h3>
                    </div>
                    {/* ****************************previewImage************************************ */}
                    <label htmlFor="previewImage" className="form-label">
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
                       <div className="errors-p-tagg">
                          {validationObj.previewImage && (<p className="errors">{validationObj.previewImage}</p>)}
                       </div>
                    </label>
                     {/* ****************************imageUrl2************************************ */}
                    <label htmlFor="imageUrl2" className="form-label">
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
                       <div className="errors-p-tagg">
                          {validationObj.imageUrl2 && <p className="errors">{validationObj.imageUrl2}</p>}
                       </div>
                    </label>
                     {/* ****************************imageUrl3************************************ */}
                    <label htmlFor="imageUrl3" className="form-label">
                       <input
                           type="url"
                           id="imageUrl3"
                           value={imageUrl3}
                           placeholder="Image URL"
                           // onChange={(e) => {
                           //   setImageUrl2(e.target.value);
                           //   clearImageError("imageUrl3");
                           // }}
                           onChange={handleInputChange(setImageUrl3, 'imageUrl3')}
                       />
                       <div className="errors-p-tagg">
                          {validationObj.imageUrl3 && <p className="errors">{validationObj.imageUrl3}</p>}
                       </div>
                    </label>
                     {/* ****************************imageUrl4************************************ */}
                    <label htmlFor="imageUrl4" className="form-label">
                       <input
                           type="url"
                           id="imageUrl4"
                           value={imageUrl4}
                           placeholder="Image URL"
                           // onChange={(e) => {
                           //   setImageUrl2(e.target.value);
                           //   clearImageError("imageUrl4");
                           // }}
                           onChange={handleInputChange(setImageUrl4, 'imageUrl4')}
                       />
                       <div className="errors-p-tagg">
                          {validationObj.imageUrl4 && <p className="errors">{validationObj.imageUrl4}</p>}
                       </div>
                    </label>
                     {/* ****************************imageUrl5************************************ */}
                    <label htmlFor="imageUrl4" className="form-label">
                       <input
                           type="url"
                           id="imageUrl5"
                           value={imageUrl5}
                           placeholder="Image URL"
                           // onChange={(e) => {
                           //   setImageUrl2(e.target.value);
                           //   clearImageError("imageUrl5");
                           // }}
                           onChange={handleInputChange(setImageUrl5, 'imageUrl5')}
                       />
                       <div className="errors-p-tagg">
                          {validationObj.imageUrl5 && <p className="errors">{validationObj.imageUrl5}</p>}
                       </div>
                    </label>
                    <hr></hr>
                    </>
                   )}
            </div>

            {/* <div className='button-form-div'> */}
            <button className="spot-form-btn" type="submit" disabled={Object.keys(validationObj).length > 0}>
              {formType === "Create" ? "Create Spot" : "Update Spot"}
            </button>
            {/* </div> */}
        </div>
      </form>
    </div>
  );
}
