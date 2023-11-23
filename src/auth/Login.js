import React, { useState } from "react";
import styles from "./Login.module.css";
import pageTitle from "../images/pageTitle2.png";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";

export const Login = ({ handleChange }) => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.data.user.user);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [error, setError] = useState(null);
  const [emailInclude, setEmailInclude] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordType, setPasswordType] = useState("password");

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleLogin = async () => {
    if (email.length === 0) {
      setEmailError(true);
      setEmailInclude(false);
    }
    if (password.length === 0) {
      setPasswordError(true);
    }
    if (email.length > 0 && !email.includes("@" && ".com")) {
      setEmailError(false);
      setEmailInclude(true);
    }

    setIsSubmitted(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      if (email.length > 0 && password.length > 0)
        setError("Wrong Email or Password.");
    }
  };

  const handleLoginKeyDown = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  const togglePassword = () => {
    if (!showPassword) {
      setShowPassword(true);
      setPasswordType("text");
    } else {
      setShowPassword(false);
      setPasswordType("password");
    }
  };

  const handleEmailClick = () => {
    setEmailError(false);
    setEmailInclude(false);
  };

  const handlePasswordClick = () => {
    setPasswordError(false);
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
            value={password}
            onClick={handlePasswordClick}
            onKeyDown={handleLoginKeyDown}
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
        <button onClick={handleLogin} className={styles.button}>
          Log In
        </button>
        {error && <p className={styles.errorMsg}>{error}</p>}{" "}
      </div>
      <div className={styles.questionBox}>
        <h5>Don't have an account?</h5>
        <p onClick={handleChange}>Sign up</p>
      </div>
    </div>
  );
};
