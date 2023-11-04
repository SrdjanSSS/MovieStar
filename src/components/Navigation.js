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

const Navigation = () => {
  const user = useSelector((state) => state.data.user.user);
  const dispatch = useDispatch();

  const [scrolling, setScrolling] = useState(false);
  const [activeDot, setActiveDot] = useState(null);
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
  };

  const handleClick = (index) => {
    setActiveDot(index === activeDot ? null : index);
  };

  const handleScroll = () => {
    if (window.scrollY > 660) {
      setScrolling(true);
    } else {
      setScrolling(false);
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
        <img src={pageTitle} alt="" />
      </div>
      <div className={styles.navBox}>
        <Link to="home" smooth={true} duration={500}>
          <div
            className={`${styles.acitve} ${
              activeDot === 0 ? styles.acitve : ""
            }`}
          >
            {activeDot === 0 && <div className={styles.dot}></div>}
            <h3 onClick={() => handleClick(0)}>Home</h3>
          </div>
        </Link>
        <Link to="favorites" smooth={true} duration={800}>
          <div
            className={`${styles.acitve} ${
              activeDot === 1 ? styles.acitve : ""
            }`}
          >
            {activeDot === 1 && <div className={styles.dot}></div>}
            <h3 onClick={() => handleClick(1)}>Favorites</h3>
          </div>
        </Link>
        <Link to="movies" smooth={true} duration={500}>
          <div
            className={`${styles.acitve} ${
              activeDot === 2 ? styles.acitve : ""
            }`}
          >
            {activeDot === 2 && <div className={styles.dot}></div>}
            <h3 onClick={() => handleClick(2)}>Movies</h3>
          </div>
        </Link>
        <div className={styles.profileContainer}>
          <div onClick={toggleMenu} className={styles.profileBox}>
            <h3 className={styles.username}>{user.username}</h3>
            <FontAwesomeIcon className={styles.userIcon} icon={faCircleUser} />
          </div>
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
