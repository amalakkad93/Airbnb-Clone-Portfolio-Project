
import { NavLink } from "react-router-dom";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import logo from "../../assets/logo/long-logo.png";
import "./Navigation.css";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="navBar-container">

      <div className="navBar-inner-container">
        <div className="navBar-logo-create-link">
          <NavLink exact to="/" className="navbar-logo">
            <img src={logo} alt="logo" className="logo" />
          </NavLink>
          {/* {sessionUser && (
            <div className="navBar-create-link">
              <NavLink to="/spots/new" className="create-new-spot">
                Create a New Spot
              </NavLink>
            </div>
          )} */}
        </div>
          <div className="navBar-logo-create-link">
              {sessionUser && (
                  <div className="navBar-create-link">
                    <NavLink to="/spots/new" className="create-new-spot">
                      Create a New Spot
                    </NavLink>
                  </div>
                )}
              {isLoaded && (
                <ul className="navBar-far-right">

                  <li>
                    <ProfileButton user={sessionUser} showMenu={showMenu} />
                  </li>
                </ul>
              )}
        </div>
      </div>
    </div>
  );
}

export default Navigation;
