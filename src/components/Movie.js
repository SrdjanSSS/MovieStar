import React from "react";
import styles from "./Movie.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlayCircle } from "@fortawesome/free-solid-svg-icons";

const Movie = ({ title, image, year, id, selectMovie, item }) => {
  return (
    <div
      onClick={() => selectMovie(item)}
      key={id}
      className={styles.container}
    >
      <div className={styles.imgBox}>
        <img src={image} alt="" className={styles.img}></img>
        <div className={styles.hoverIconBox}>
          <FontAwesomeIcon className={styles.icon} icon={faPlayCircle} />
        </div>
      </div>
      <div className={styles.description}>
        <h4>{title}</h4>
        <p>{year}</p>
      </div>
    </div>
  );
};

export default Movie;
