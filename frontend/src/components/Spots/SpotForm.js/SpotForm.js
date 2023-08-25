import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import {createSpotThunk, getSpotDetailThunk, updateSpotThunk } from '../../../store/spots';

import { GetCountries, GetState, GetCity } from 'react-country-state-city';
// import { Select } from 'antd';
// import 'antd/dist/antd.css';

import './CreateSpotForm.css';

export default function SpotForm({ formType, spotId }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [address, setAddress] = useState("");
  const [countryid, setCountryid] = useState("");
  const [stateid, setStateid] = useState("");
  const [cityid, setCityid] = useState("");
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
        setCountryid(data.country);
        setStateid(data.state);
        setCityid(data.city);


        GetState(data.country).then((states) => setStateList(states));
        GetCity(data.country, data.state).then((cities) => setCityList(cities));
        setInitialSpot(data);
      });
    }
  }, [dispatch, formType, spotId]);

 // =========================================

  useEffect(() => {
    if (countryid) {
        GetState(countryid).then((states) => setStateList(states)).catch(error => {console.error("Error fetching states:", error)});
    }
}, [countryid]);
// =========================================

useEffect(() => {
    if (stateid) {
        GetCity(countryid, stateid).then((cities) => setCityList(cities)).catch(error => {console.error("Error fetching cities:", error)});
    }
}, [stateid]);
// =========================================

// *******************************************


  // *************clearImageError************
  const clearImageError = (fieldName) => {
    validationObj[fieldName] && setValidationObj(prevState => ({ ...prevState, [fieldName]: "" }));
  };
  // ****************************************

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
    if (!cityid) errors.cityid = "City is required";
    if (!stateid) errors.stateid = "State is required";
    if (!countryid) errors.countryid = "Country is required";
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
      city: getNameById(cityList, cityid),
      state: getNameById(stateList, stateid),
      country: getNameById(countriesList, countryid),
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
          city: getNameById(cityList, cityid) || initialSpot.city,
          state: getNameById(stateList, stateid) || initialSpot.state,
          country: getNameById(countriesList, countryid) || initialSpot.country,
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
  // *****************************************

  return (
    <>
    <div className="form-container">
         <form
               className={formType === "Create" ? "create-container" : "edit-container"}
               onSubmit={handleSubmit}
         >
               <h1>{formType === "Create" ? "Create a new Spot" : "Update your Spot"}</h1>
         </form>
    </div>
    </>
  )
}
