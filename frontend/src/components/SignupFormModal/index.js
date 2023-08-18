import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
import "./SignupForm.css";

function SignupFormModal() {
    const dispatch = useDispatch();
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState({});
    const { closeModal } = useModal();

    const handleModalClose = () => {
        setEmail("");
        setUsername("");
        setFirstName("");
        setLastName("");
        setPassword("");
        setConfirmPassword("");
        setErrors({});
        closeModal();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password === confirmPassword) {
            setErrors({});
            return dispatch(
                sessionActions.signup({
                    email,
                    username,
                    firstName,
                    lastName,
                    password,
                })
            )
                .then(handleModalClose)
                .catch(async (res) => {
                    const data = await res.json();
                    if (data && data.errors) {
                        setErrors(data.errors);
                    }
                });
        }
        return setErrors({
            confirmPassword: "Confirm Password field must be the same as the Password field"
        });
    };

    const isSignupDisabled =
        !email ||
        username.length < 4 ||
        !firstName ||
        !lastName ||
        password.length < 6 ||
        !confirmPassword;

    return (
        <>
            <form onSubmit={handleSubmit} className="signup-form">
                {/* Email */}
                <label className="label-signup">
                    <div className="label-title">Email</div>
                    <input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </label>
                {errors.email && <p>{errors.email}</p>}

                {/* Username */}
                <label className="label-signup">
                    <div>Username</div>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </label>
                {errors.username && <p>{errors.username}</p>}

                {/* First Name */}
                <label className="label-signup">
                    <div>First Name</div>
                    <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                    />
                </label>
                {errors.firstName && <p>{errors.firstName}</p>}

                {/* Last Name */}
                <label className="label-signup">
                    <div>Last Name</div>
                    <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                    />
                </label>
                {errors.lastName && <p>{errors.lastName}</p>}

                {/* Password */}
                <label className="label-signup">
                    <div>Password</div>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </label>
                {errors.password && <p>{errors.password}</p>}

                {/* Confirm Password */}
                <label className="label-signup">
                    <div>Confirm Password</div>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </label>
                {errors.confirmPassword && (
                    <p>{errors.confirmPassword}</p>
                )}

                <button type="submit" disabled={isSignupDisabled}>Sign Up</button>
            </form>
        </>
    );
}

export default SignupFormModal;


// // frontend/src/components/SignupFormModal/index.js
// import React, { useState } from "react";
// import { useDispatch } from "react-redux";
// import { useModal } from "../../context/Modal";
// import * as sessionActions from "../../store/session";
// import "./SignupForm.css";

// function SignupFormModal() {
//   const dispatch = useDispatch();
//   const [email, setEmail] = useState("");
//   const [username, setUsername] = useState("");
//   const [firstName, setFirstName] = useState("");
//   const [lastName, setLastName] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [errors, setErrors] = useState({});
//   const { closeModal } = useModal();

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (password === confirmPassword) {
//       setErrors({});
//       return dispatch(
//         sessionActions.signup({
//           email,
//           username,
//           firstName,
//           lastName,
//           password,
//         })
//       )
//         .then(closeModal)
//         .catch(async (res) => {
//           const data = await res.json();
//           if (data && data.errors) {
//             setErrors(data.errors);
//           }
//         });
//     }
//     return setErrors({
//       confirmPassword: "Confirm Password field must be the same as the Password field"
//     });
//   };

//   return (
//     <>
//       {/* <h1>Sign Up</h1> */}
//       <form onSubmit={handleSubmit} className="signup-form">
//         <label className="label-signup">
//         <div class="label-title">Email</div>
//           <input
//             type="text"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />

//         </label>
//         {errors.email && <p>{errors.email}</p>}
//         <label className="label-signup">
//           <div>Username</div>
//           <input
//             type="text"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             required
//           />
//         </label>
//         {errors.username && <p>{errors.username}</p>}
//         <label className="label-signup">
//           <div>First Name</div>
//           <input
//             type="text"
//             value={firstName}
//             onChange={(e) => setFirstName(e.target.value)}
//             required
//           />
//         </label>
//         {errors.firstName && <p>{errors.firstName}</p>}
//         <label className="label-signup">
//           <div>Last Name</div>
//           <input
//             type="text"
//             value={lastName}
//             onChange={(e) => setLastName(e.target.value)}
//             required
//           />
//         </label>
//         {errors.lastName && <p>{errors.lastName}</p>}
//         <label className="label-signup">
//           <div>Password</div>
//           <input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//         </label>
//         {errors.password && <p>{errors.password}</p>}
//         <label className="label-signup">
//           <div>Confirm Password</div>
//           <input
//             type="password"
//             value={confirmPassword}
//             onChange={(e) => setConfirmPassword(e.target.value)}
//             required
//           />
//         </label>
//         {errors.confirmPassword && (
//           <p>{errors.confirmPassword}</p>
//         )}
//         <button type="submit">Sign Up</button>
//       </form>
//     </>
//   );
// }

// export default SignupFormModal;
