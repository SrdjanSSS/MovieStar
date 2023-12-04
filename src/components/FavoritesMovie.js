import React from "react";
import styles from "./FavoritesMovies.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark, faPlayCircle } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { Link } from "react-scroll";

const FavoritesMovie = ({ selectMovie, item, deleteShow }) => {
  const handleDeleteShow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    deleteShow(item.id);
    toast.error(`${item.Title} removed from Favorites`, {
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
      <div onClick={() => selectMovie(item)} className={styles.container}>
        <div className={styles.imgBox}>
          <img src={item.Img} alt="" className={styles.img}></img>
          <div className={styles.hoverIconBox}>
            <FontAwesomeIcon className={styles.icon} icon={faPlayCircle} />
            <FontAwesomeIcon
              onClick={handleDeleteShow}
              className={styles.icon}
              icon={faCircleXmark}
            />
          </div>
        </div>
        <div className={styles.descriptionBox}>
          <div className={styles.description}>
            <h4>{item.Title}</h4>
            <p>{item.Year}</p>
          </div>
          <div className={styles.voteBox}>{item.Vote}</div>
        </div>
      </div>
    </Link>
  );
};

export default FavoritesMovie;
