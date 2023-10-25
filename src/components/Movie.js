import React, { useState } from "react";
import styles from "./Movie.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleXmark,
  faPlayCircle,
  faPlusCircle,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-scroll";
import { toast } from "react-toastify";

const Movie = ({
  title,
  image,
  year,
  id,
  selectMovie,
  item,
  addToFavorites,
  isAddedToFavorites,
  removeFromFavorites,
  addedAt,
}) => {
  const handleAddToFavorites = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToFavorites(item);
    toast.success(`${title} added to Favorites`, {
      position: "bottom-left",
      autoClose: 2000,
      style: {
        background: "black",
        color: "white",
      },
    });
  };

  return (
    <Link to="home" smooth={true} duration={500}>
      <div
        onClick={() => selectMovie(item)}
        key={id}
        className={styles.container}
      >
        <div className={styles.imgBox}>
          <img src={image} alt="" className={styles.img}></img>
          <div className={styles.hoverIconBox}>
            <FontAwesomeIcon className={styles.icon} icon={faPlayCircle} />
            {!isAddedToFavorites ? (
              <FontAwesomeIcon
                onClick={handleAddToFavorites}
                className={styles.icon}
                icon={faPlusCircle}
              />
            ) : (
              <FontAwesomeIcon
                onClick={(e) => removeFromFavorites(item.addedAt, title, e)}
                className={styles.icon}
                icon={faCircleXmark}
              />
            )}
          </div>
        </div>
        <div className={styles.description}>
          <h4>{title}</h4>
          <p>{year}</p>
        </div>
      </div>
    </Link>
  );
};

export default Movie;
