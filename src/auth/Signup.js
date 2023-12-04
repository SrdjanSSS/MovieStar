import React, { useState } from "react";
import styles from "./Signup.module.css";
import pageTitle from "../images/pageTitle2.png";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth, db } from "../firebase";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../features/UserSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faEye,
  faEyeSlash,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { setDoc, doc } from "firebase/firestore";

const Signup = ({ handleChange }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.data.user.user);

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [usernameLenght, setUsernameLength] = useState(false);
  const [emailInclude, setEmailInclude] = useState(false);
  const [shortPassword, setShortPassword] = useState(false);
  const [passwordType, setPasswordType] = useState("password");
  const [showPassword, setShowPassword] = useState(false);
  const [emailAlreadyExists, setEmailAlreadyExists] = useState(false);

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleSignUp = () => {
    if (username.length === 0) {
      setUsernameError(true);
      return;
    } else if (username.length >= 8) {
      setUsernameLength(true);
      return;
    } else {
      createUserWithEmailAndPassword(auth, email, password)
        .then(() => {
          setDoc(doc(db, "users", email), {
            favoriteShows: [],
          });
        })
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
          if (password.length !== 0 && username.length !== 0) {
            if (validEmailFormat.test(email)) {
              if (email.includes("@" && ".com")) {
                setEmailAlreadyExists(true);
                setEmailError(false);
                setEmailInclude(false);
              }
            }
          }
        });
    }

    const validEmailFormat = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/;

    if (!validEmailFormat.test(email)) {
      setEmailAlreadyExists(false);
      setEmailInclude(true);
    }

    if (email.length === 0) {
      setEmailError(true);
      setEmailInclude(false);
    }

    if (email.length > 0 && !email.includes("@" && ".com")) {
      setEmailInclude(true);
      setEmailError(false);
    }

    if (password.length === 0) {
      setPasswordError(true);
      setShortPassword(false);
    } else if (password.length < 6) {
      setShortPassword(true);
      setPasswordError(false);
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

  const handleSignupKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSignUp();
    }
  };

  const handleEmailClick = () => {
    setEmailError(false);
    setEmailInclude(false);
    setEmailAlreadyExists(false);
  };

  const handleUsernameClick = () => {
    setUsernameError(false);
    setUsernameLength(false);
  };

  const handlePasswordClick = () => {
    setPasswordError(false);
    setShortPassword(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.inputBox}>
        <Link to={"/"}>
          <img className={styles.pageTitle} src={pageTitle} alt="" />
        </Link>
        <div className={styles.inputContainer}>
          <input
            value={email}
            onClick={handleEmailClick}
            onChange={(e) => setEmail(e.target.value)}
            type="text"
            placeholder="Email"
            className={
              emailAlreadyExists || emailError || emailInclude
                ? styles.inputError
                : styles.input
            }
          />
          <div className={styles.iconBox}>
            <FontAwesomeIcon className={styles.icon} icon={faEnvelope} />
          </div>
        </div>

        {emailError ? <p>Email field is required.</p> : ""}
        {emailInclude ? <p>Email is not valid.</p> : ""}
        {emailAlreadyExists ? <p>Email already exists.</p> : ""}
        <div className={styles.inputContainer}>
          <input
            value={username}
            onClick={handleUsernameClick}
            onChange={(e) => setUsername(capitalizeFirstLetter(e.target.value))}
            type="text"
            placeholder="Username"
            className={
              usernameError || usernameLenght ? styles.inputError : styles.input
            }
          />
          <div className={styles.iconBox}>
            <FontAwesomeIcon className={styles.icon} icon={faUser} />
          </div>
        </div>

        {usernameError ? <p>Username field is required.</p> : ""}
        {usernameLenght ? <p>Username must be under 8 characters</p> : ""}
        <div className={styles.inputContainer}>
          <input
            value={password}
            onClick={handlePasswordClick}
            onKeyDown={handleSignupKeyDown}
            onChange={(e) => setPassword(e.target.value)}
            type={passwordType}
            placeholder="Password"
            className={
              passwordError || shortPassword ? styles.inputError : styles.input
            }
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
