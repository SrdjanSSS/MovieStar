import React, { useState } from "react";
import styles from "./Signup.module.css";
import pageTitle from "../images/pageTitle2.png";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "../firebase";
import { useDispatch } from "react-redux";
import { loginUser } from "../features/UserSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faEye,
  faEyeSlash,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

const Signup = ({ handleChange }) => {
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [error, setError] = useState(false);
  const [emailInclude, setEmailInclude] = useState(false);
  const [shortPassword, setShortPassword] = useState(false);
  const [passwordType, setPasswordType] = useState("password");
  const [showPassword, setShowPassword] = useState(false);

  const handleSignUp = (event) => {
    event.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        signInWithEmailAndPassword(auth, email, password).then(() => {
          updateProfile(auth.currentUser, {
            displayName: username,
          }).then(() => {
            dispatch(
              loginUser({
                uid: auth.currentUser.uid,
                username: username,
                email: auth.currentUser.email,
              })
            );
          });
        });
      })
      .catch((err) => {
        console.log(err);
      });

    if (email.length === 0) {
      setEmailError(true);
      setEmailInclude(false);
    }
    if (username.length === 0) {
      setUsernameError(true);
    }
    if (password.length === 0) {
      setPasswordError(true);
      setShortPassword(false);
    } else if (password.length < 6) {
      setShortPassword(true);
      setPasswordError(false);
    }

    if (email.length > 0 && !email.includes("@" && ".com")) {
      setEmailInclude(true);
      setEmailError(false);
    }
  };

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const togglePassword = () => {
    if (!showPassword) {
      setShowPassword(true);
      setPasswordType("text");
    } else {
      setShowPassword(false);
      setPasswordType("password");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.inputBox}>
        <img className={styles.pageTitle} src={pageTitle} alt="" />
        <div className={styles.inputContainer}>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="text"
            placeholder="Email"
            className={
              emailError || emailInclude ? styles.inputError : styles.input
            }
          />
          <div className={styles.iconBox}>
            <FontAwesomeIcon className={styles.icon} icon={faEnvelope} />
          </div>
        </div>

        {emailError ? <p>Email field is required.</p> : ""}
        {emailInclude ? <p>Email is not valid.</p> : ""}
        <div className={styles.inputContainer}>
          <input
            value={username}
            onChange={(e) => setUsername(capitalizeFirstLetter(e.target.value))}
            type="text"
            placeholder="Username"
            className={usernameError ? styles.inputError : styles.input}
          />
          <div className={styles.iconBox}>
            <FontAwesomeIcon className={styles.icon} icon={faUser} />
          </div>
        </div>

        {usernameError ? <p>Username field is required.</p> : ""}
        <div className={styles.inputContainer}>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type={passwordType}
            placeholder="Password"
            className={passwordError ? styles.inputError : styles.input}
          />
          <div onClick={togglePassword} className={styles.passwordIconBox}>
            {!showPassword ? (
              <FontAwesomeIcon className={styles.icon} icon={faEye} />
            ) : (
              <FontAwesomeIcon icon={faEyeSlash} className={styles.icon} />
            )}
          </div>
        </div>
        {passwordError ? <p>Password field is required.</p> : ""}
        {shortPassword ? (
          <p>Password needs to contain at least 6 characters.</p>
        ) : (
          ""
        )}
        <button onClick={handleSignUp} className={styles.button}>
          Sign up
        </button>
      </div>
      <div className={styles.questionBox}>
        <h5>Already have an account?</h5>
        <p onClick={handleChange}>Log In</p>
      </div>
    </div>
  );
};

export default Signup;
