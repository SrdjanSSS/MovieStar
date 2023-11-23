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
import { useSelector } from "react-redux";
import { db } from "../firebase";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";

const Movie = ({
  title,
  image,
  year,
  selectMovie,
  item,
  setLoginPopup,
  vote,
  deleteShow,
  addedMovies,
}) => {
  const user = useSelector((state) => state.data.user.user);

  const [saved, setSaved] = useState(false);

  const isMovieAdded = (addedMovies ?? []).some(
    (addedMovie) => addedMovie.id === item.id
  );

  const movieID = doc(db, "users", `${user?.email}`);

  const saveShow = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isMovieAdded) {
      deleteShow(item.id);
      toast.error(`${item.title} removed from Favorites`, {
        position: "bottom-left",
        autoClose: 2000,
        style: {
          background: "black",
          color: "white",
        },
      });
    } else if (user?.email) {
      setSaved(true);
      toast.success(`${title} added to Favorites`, {
        position: "bottom-left",
        autoClose: 2000,
        style: {
          background: "black",
          color: "white",
        },
      });
      await updateDoc(movieID, {
        favoriteShows: arrayUnion({
          id: item.id,
          Title: title,
          Img: image,
          Year: year,
          Vote: vote,
        }),
      });
    } else {
      setLoginPopup(true);
    }
  };

  return (
    <Link to="home" smooth={true} duration={500}>
      <div onClick={() => selectMovie(item)} className={styles.container}>
        <div className={styles.imgBox}>
          <img src={image} alt="" className={styles.img}></img>
          <div className={styles.hoverIconBox}>
            <FontAwesomeIcon className={styles.icon} icon={faPlayCircle} />
            <FontAwesomeIcon
              onClick={saveShow}
              className={styles.icon}
              icon={isMovieAdded ? faCircleXmark : faPlusCircle}
            />
          </div>
        </div>
        <div className={styles.descriptionBox}>
          <div className={styles.description}>
            <h4>{title}</h4>
            <p>{year}</p>
          </div>
          <div className={styles.voteBox}>{vote}</div>
        </div>
      </div>
    </Link>
  );
};

export default Movie;
