import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleModalClose = () => {
     setCredential("");
     setPassword("");
     setErrors({});
     closeModal();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(handleModalClose)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  const isLoginDisabled = () => credential.length < 4 || password.length < 6;

  return (
    <>
      <form onSubmit={handleSubmit} className="login-form">
        <div>
          <label className="label-login">
            <div className="label-title"></div>
            <input
              type="text"
              value={credential}
              placeholder="Username or Email"
              onChange={(e) => setCredential(e.target.value)}
              required
            />
          </label>
          {errors.credential && <p className="errors">{errors.credential}</p>}
        </div>
        <div>
          <div className="label-title"></div>
          <label className="label-login">
            <input
              type="password"
              value={password}
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          {errors.password && <p className="errors">{errors.password}</p>}
        </div>
        <button type="submit" disabled={isLoginDisabled()}>Log In</button>
      </form>
    </>
  );
}

export default LoginFormModal;



// frontend/src/components/LoginFormModal/index.js
// import React, { useState } from "react";
// import * as sessionActions from "../../store/session";
// import { useDispatch } from "react-redux";
// import { useModal } from "../../context/Modal";
// import "./LoginForm.css";

// function LoginFormModal() {
//   const dispatch = useDispatch();
//   const [credential, setCredential] = useState("");
//   const [password, setPassword] = useState("");
//   const [errors, setErrors] = useState({});
//   const { closeModal } = useModal();

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     setErrors({});
//     return dispatch(sessionActions.login({ credential, password }))
//       .then(closeModal)
//       .catch(async (res) => {
//         const data = await res.json();
//         if (data && data.errors) {
//           setErrors(data.errors);
//         }
//       });
//   };

//   return (
//     <>
//       {/* <div><h1>Log In</h1></div> */}
//       <form onSubmit={handleSubmit} className="spot-form">
//         <div>
//         <label className="label-login">
//           <div class="label-title"></div>
//           <input
//             type="text"
//             value={credential}
//             placeholder="Username or Email"
//             onChange={(e) => setCredential(e.target.value)}
//             required
//           />
//         </label>
//         {errors.credential && <p className="errors">{errors.credential}</p>}
//         </div>
//         <div>
//           <div class="label-title"></div>
//         <label className="label-login">
//           {/* Password */}
//           <input
//             type="password"
//             value={password}
//             placeholder="Password"
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//         </label>
//         </div>
//         {errors.credential && (
//           <p>{errors.credential}</p>
//         )}
//         <button type="submit">Log In</button>

//       </form>
//     </>
//   );
// }

// export default LoginFormModal;
