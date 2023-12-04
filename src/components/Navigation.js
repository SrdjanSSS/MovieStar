import React, { useEffect, useState } from "react";
import styles from "./Navigation.module.css";
import pageTitle from "../images/pageTitle2.png";
import { Link } from "react-scroll";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../features/UserSlice";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { motion } from "framer-motion";
import { Link as PathLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Navigation = ({ setLoginPopup }) => {
  const user = useSelector((state) => state.data.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [scrolling, setScrolling] = useState(false);
  const [menu, setMenu] = useState(false);

  const toggleMenu = () => {
    if (!menu) {
      setMenu(true);
    } else {
      setMenu(false);
    }
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    signOut(auth);

    if (user) {
      navigate("/auth");
    }
  };

  const handleScroll = () => {
    if (window.scrollY > 660) {
      setScrolling(true);
    } else {
      setScrolling(false);
    }
  };

  const handleLoginPopup = () => {
    if (!user) {
      setLoginPopup(true);
    } else {
      setLoginPopup(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className={`${styles.navbar} ${scrolling ? styles.scrolling : ""}`}>
      <div className={styles.titleBox}>
        <PathLink to={"/"}>
          <img src={pageTitle} alt="" />
        </PathLink>
      </div>
      <div className={styles.navBox}>
        <Link to="home" smooth={true} duration={500}>
          <h3 className={styles.homeH3}>Home</h3>
        </Link>
        <Link to="favorites" smooth={true} duration={800}>
          <h3 onClick={handleLoginPopup} className={styles.favoritesH3}>
            Favorites
          </h3>
        </Link>
        <Link to="movies" smooth={true} duration={500}>
          <h3 className={styles.moviesH3}>Movies</h3>
        </Link>
        <div className={styles.profileContainer}>
          {user ? (
            <div onClick={toggleMenu} className={styles.profileBox}>
              <h3 className={styles.username}>{user.username}</h3>
              <FontAwesomeIcon
                className={styles.userIcon}
                icon={faCircleUser}
              />
            </div>
          ) : (
            <PathLink
              style={{ color: "white", textDecoration: "none" }}
              to="/auth"
            >
              <div className={styles.loginBtnBox}>
                <h3>Log In</h3>
              </div>
            </PathLink>
          )}
          {menu && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className={styles.fallingMenu}
              onClick={handleLogout}
            >
              Log Out
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navigation;
