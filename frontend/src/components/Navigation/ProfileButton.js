// frontend/src/components/Navigation/ProfileButton.js
// frontend/src/components/Navigation/ProfileButton.js
import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import OpenModalMenuItem from './OpenModalMenuItem';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import { useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faBars } from '@fortawesome/free-solid-svg-icons';


import "./Navigation.css";


function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();
  const navigate = useNavigate();

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    closeMenu();
    navigate('/');
  };

  // const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");
  const ulClassName = "profile-dropdown";

  return (
    <>
    <div className="profile-dropdown-container">
      <div className="btn">
        <button className="navigation-btn" aria-label="Main navigation menu" onClick={openMenu}>
          <FontAwesomeIcon icon={faBars} className="menu-icon" />
          <FontAwesomeIcon icon={faUserCircle} className="profile-icon" />
        </button>
      </div>
      <div className="menu-drop-down">


      {/* <ul className={ulClassName} ref={ulRef}> */}
      <ul className={ulClassName} ref={ulRef} style={{ display: showMenu ? 'block' : 'none' }}>
        {user ? (
          <>
            {/* <li>{user.username}</li> */}
            <ul className="center-menu" style={{ color: "black"}}>{user.username}</ul>
            <ul className="center-menu">{user.firstName} {user.lastName}</ul>
            <ul className="center-menu">{user.email}</ul>
            <ul className="center-menu"><button className="Manage-spot-button" onClick={ (e) => {closeMenu(); navigate('/owner/spots')}}>Manage Spots</button></ul>
            <ul><button type="button" className="center-menu" onClick={(e)=>{closeMenu(); navigate('/reviews/current') }}>Manage Reviews</button></ul>
            <ul><button onClick={logout} className="buttons center-menu">Log Out</button></ul>
          </>
        ) : (
          <>
          <li>
            <OpenModalMenuItem
              itemText="Log In"
              onItemClick={closeMenu}
              modalComponent={<LoginFormModal />}
              />
          </li>
          <li>
            <OpenModalMenuItem
              itemText="Sign Up"
              onItemClick={closeMenu}
              modalComponent={<SignupFormModal />}
              />
          </li>
          <li>
          <button className="buttons" onClick={(e) =>{
            const credential = "Demo-lition"
            const password = "password"
            closeMenu()
            return dispatch(sessionActions.login({credential, password}))
          }}>Demo User</button>
          </li>
          </>
        )}
      </ul>

      </div>
    </div>
    </>
  );
}

export default ProfileButton;
