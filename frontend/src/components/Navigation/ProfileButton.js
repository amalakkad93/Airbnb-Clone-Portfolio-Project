// frontend/src/components/Navigation/ProfileButton.js
// frontend/src/components/Navigation/ProfileButton.js
import React, { useState, useEffect, useRef } from "react";
// import { Link } from "react-router-dom";
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import OpenModalMenuItem from './OpenModalMenuItem';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import { useNavigate, Link } from "react-router-dom";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faBars } from '@fortawesome/free-solid-svg-icons';


import "./Navigation.css";


function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();
  const navigate = useNavigate();
  const userInitials = user && `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;

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
          {/* <FontAwesomeIcon icon={faUserCircle} className="profile-icon" /> */}
          {user && <div className="user-initials1">{userInitials.toUpperCase()}</div>}

        </button>
      </div>
      <div className="menu-drop-down">


      {/* <ul className={ulClassName} ref={ulRef}> */}
      <ul className={ulClassName} ref={ulRef} style={{ display: showMenu ? 'block' : 'none' }}>
        {user ? (
          <>
            {/* <li>{user.username}</li> */}
            {/* <ul className="center-menu" style={{ color: "black"}}>{user.username}</ul>
            <ul className="center-menu">{user.firstName} {user.lastName}</ul>
            <ul className="center-menu">{user.email}</ul> */}
            <ul className="center-menu">
            <Link to="/users/show" onClick={closeMenu} style={{ textDecoration: 'none', color: 'black', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <FontAwesomeIcon icon={faUserCircle} style={{ marginRight: '8px' }} />
              <li className="center-menu center-menu-profile">Profile</li>
            </Link>
            </ul>


            <ul className="center-menu"><button className="Manage-spot-button center-menu1" onClick={ (e) => {closeMenu(); navigate('/owner/spots')}}>Manage Spots</button></ul>
            <ul><button type="button" className="center-menu1" onClick={(e)=>{closeMenu(); navigate('/reviews/current') }}>Manage Reviews</button></ul>
            <ul><button onClick={logout} className="buttons center-menu center-menu1">Log Out</button></ul>
          </>
        ) : (
          <>
          <ul className="center-menu">
            <OpenModalMenuItem
            className="center-menu"
              itemText="Log In"
              onItemClick={closeMenu}
              modalComponent={<LoginFormModal />}
              />
          </ul>
          <ul  className="center-menu">
            <OpenModalMenuItem
              className="center-menu"
              itemText="Sign Up"
              onItemClick={closeMenu}
              modalComponent={<SignupFormModal />}
              />
          </ul>
          {/* <ul  className="center-menu">
          <button className="center-menu" onClick={(e) =>{
            const credential = "Demo-lition"
            const password = "password"
            closeMenu()
            return dispatch(sessionActions.login({credential, password}))
          }}>Demo User</button>
          </ul> */}
          </>
        )}
      </ul>

      </div>
    </div>
    </>
  );
}

export default ProfileButton;
