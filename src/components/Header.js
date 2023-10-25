import React, { useState } from "react";
import styles from "./Header.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFaceFrown,
  faPlay,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import YouTube from "react-youtube";

const Header = ({ movies, selectedMovie }) => {
  const [trailerPopup, setTrailerPopup] = useState(false);
  const [isTrailerClicked, setIsTrailerClicked] = useState(false);

  const rednderTrailer = () => {
    if (trailerPopup && selectedMovie.videos && selectedMovie.videos.results) {
      const trailer = selectedMovie.videos.results.find(
        (vid) => vid.name === "Official Trailer"
      );

      if (trailer && trailer.key) {
        return <YouTube className={styles.youtube} videoId={trailer.key} />;
      } else {
        return (
          <div className={styles.erorrMessageBox}>
            <FontAwesomeIcon className={styles.iconSad} icon={faFaceFrown} />
            <p>Sorry, currently there is no trailer for this film.</p>
          </div>
        );
      }
    }

    return null;
  };

  const handleTrailerPopup = () => {
    if (!trailerPopup) {
      setTrailerPopup(true);
      setIsTrailerClicked(true);
    } else {
      setTrailerPopup(false);
      setIsTrailerClicked(false);
    }
  };

  return (
    <div
      id="home"
      key={selectedMovie.id}
      style={{
        backgroundSize: "cover",
        backgroundImage: `url('https://image.tmdb.org/t/p/original/${selectedMovie.backdrop_path}')`,
      }}
      className={styles.container}
    >
      <div className={styles.boxContainer}>
        <div className={styles.boxL}>
          <h1>{selectedMovie.title}</h1>
          <h4>{selectedMovie.overview}</h4>
        </div>
        <div className={styles.outerBox}>
          {selectedMovie.videos ? rednderTrailer() : null}
          <h2>{isTrailerClicked ? "Close Trailer" : "Play Trailer"}</h2>
          <div onClick={handleTrailerPopup} className={styles.boxR}>
            <div className={styles.iconBox}>
              {isTrailerClicked ? (
                <FontAwesomeIcon className={styles.iconX} icon={faXmark} />
              ) : (
                <FontAwesomeIcon className={styles.iconPlay} icon={faPlay} />
              )}
            </div>
          </div>
        </div>
      </div>
      <div className={styles.imageOverlay}></div>
    </div>
  );
};

export default Header;
