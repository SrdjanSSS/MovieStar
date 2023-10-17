import React, { useState } from "react";
import styles from "./Header.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import YouTube from "react-youtube";

const Header = ({ movies, selectedMovie }) => {
  const [trailerPopup, setTrailerPopup] = useState(false);
  const rednderTrailer = () => {
    if (trailerPopup) {
      const trailer = selectedMovie.videos.results.find(
        (vid) => vid.name === "Official Trailer"
      );

      return <YouTube className={styles.youtube} videoId={trailer.key} />;
    }
  };

  const handleTrailerPopup = () => {
    if (!trailerPopup) {
      setTrailerPopup(true);
    } else {
      setTrailerPopup(false);
    }
  };

  return (
    <div
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
          <div onClick={handleTrailerPopup} className={styles.boxR}>
            <div className={styles.iconBox}>
              <FontAwesomeIcon className={styles.icon} icon={faPlay} />
            </div>
          </div>
        </div>
      </div>
      <div className={styles.imageOverlay}></div>
    </div>
  );
};

export default Header;
