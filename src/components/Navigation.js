import React, { useEffect, useState } from "react";
import styles from "./Navigation.module.css";
import pageTitle from "../images/pageTitle2.png";
import { Link } from "react-scroll";

const Navigation = () => {
  const [scrolling, setScrolling] = useState(false);
  const [activeDot, setActiveDot] = useState(null);

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
        <div className={styles.singInBox}>
          <h3>Sign In</h3>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
