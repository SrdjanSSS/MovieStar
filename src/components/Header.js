import React, { useState } from "react";
import styles from "./Header.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFaceFrown,
  faPlay,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import YouTube from "react-youtube";
import { useSelector } from "react-redux";

const Header = ({ movies, selectedMovie, setLoginPopup }) => {
  const user = useSelector((state) => state.data.user.user);

  const [trailerPopup, setTrailerPopup] = useState(false);
  const [isTrailerClicked, setIsTrailerClicked] = useState(false);
  const [trailerPlayed, setTrailerPlayed] = useState(false);
  const [movieInfo, setMovieInfo] = useState(false);

  const rednderTrailer = () => {
    if (trailerPopup && selectedMovie.videos && selectedMovie.videos.results) {
      const trailer = selectedMovie.videos.results.find(
        (vid) => vid.name === "Official Trailer"
      );

      if (trailer && trailer.key) {
        return (
          <>
            <YouTube
              className={styles.youtubeContainer}
              videoId={trailer.key}
              opts={{
                width: "100%",
                height: "100%",
                playerVars: {
                  autoplay: 1,
                  controls: 0,
                },
              }}
            />
            {trailer && trailer.key ? renderCloseBtn() : ""}
          </>
        );
      } else {
        return (
          <div className={styles.erorrMessageBox}>
            <FontAwesomeIcon className={styles.iconSad} icon={faFaceFrown} />
            <p>Sorry, currently there is no trailer for this movie.</p>
          </div>
        );
      }
    }

    return null;
  };

  const handleTrailerPopup = () => {
    if (user) {
      if (!trailerPopup) {
        setTrailerPopup(true);
        setIsTrailerClicked(true);
      } else {
        setTrailerPopup(false);
        setIsTrailerClicked(false);
      }
    } else {
      setLoginPopup(true);
    }
  };

  const renderCloseBtn = () => {
    return (
      <button
        onClick={() => {
          setTrailerPopup(false);
          setIsTrailerClicked(false);
          setTrailerPlayed(false);
        }}
        className={styles.closeBtn}
      >
        Close
      </button>
    );
  };

  const toggleInfo = () => {
    if (!movieInfo) {
      setMovieInfo(true);
    } else {
      setMovieInfo(false);
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
          <div>
            <h1>{selectedMovie.title}</h1>
            <div>
              <button onClick={toggleInfo} className={styles.infoBtn}>
                Info
              </button>
            </div>
          </div>
          <h4 className={movieInfo ? "" : styles.infoH4}>
            {selectedMovie.overview}
          </h4>
        </div>
        <div className={styles.boxR}>
          <div className={styles.outerBox}>
            {selectedMovie.videos ? rednderTrailer() : null}
            <h2 className={styles.trailerH2}>
              {isTrailerClicked ? "Close Trailer" : "Play Trailer"}
            </h2>
            <div onClick={handleTrailerPopup} className={styles.trailerBtnBox}>
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
      </div>
      <div className={styles.imageOverlay}></div>
    </div>
  );
};

export default Header;
