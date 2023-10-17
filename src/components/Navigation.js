import React from "react";
import styles from "./Navigation.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import pageTitle from "../images/pageTitle2.png";
const Navigation = () => {
  return (
    <div className={styles.navbar}>
      <div className={styles.titleBox}>
        <img src={pageTitle} alt="" />
      </div>
      <div className={styles.navBox}>
        <FontAwesomeIcon className={styles.icon} icon={faMagnifyingGlass} />
        <h3>Home</h3>
        <h3>Movies</h3>
        <div className={styles.singInBox}>
          <h3>Sign In</h3>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
