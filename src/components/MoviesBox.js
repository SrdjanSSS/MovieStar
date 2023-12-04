import React, { useEffect, useState } from "react";
import styles from "./MoviesBox.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faPlus } from "@fortawesome/free-solid-svg-icons";
import Movie from "./Movie";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { motion } from "framer-motion";
import { db } from "../firebase";
import { useSelector } from "react-redux";
import FavoritesMovie from "./FavoritesMovie";

const MoviesBox = ({
  movies,
  fetchData,
  selectMovie,
  setLoginPopup,
  genres,
  fetchMoreMovies,
  setMovies,
  upencomingMovies,
  fetchMoreUpcomingMovies,
  awardWinningMovies,
  fetchMoreAwardWinningMovies,
  setUpencomingMovies,
  setAwardWinningMovies,
}) => {
  const user = useSelector((state) => state.data.user.user);

  const [search, setSearch] = useState("");
  const [isInputClicked, setIsInputClicked] = useState(false);
  const [genresPopup, setGenresPopup] = useState(false);
  const [redP, setRedP] = useState("");
  const [addedMovies, setAddedMovies] = useState([]);

  const movieRef = doc(db, "users", `${user?.email}`);

  const deleteShow = async (passedID) => {
    try {
      const result = addedMovies.filter((item) => item.id !== passedID);
      await updateDoc(movieRef, {
        favoriteShows: result,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    onSnapshot(doc(db, "users", `${user?.email}`), (doc) => {
      setAddedMovies(doc.data()?.favoriteShows);
    });
  }, [user?.email]);

  const handleSort = (sortOrder, arr, fn) => {
    let sortedMovies;

    if (sortOrder === "By Popularity A" || sortOrder === "By Popularity D") {
      sortedMovies = [...arr].sort((a, b) => {
        return sortOrder === "By Popularity A"
          ? a.vote_average - b.vote_average
          : b.vote_average - a.vote_average;
      });
    } else if (sortOrder === "By Realease A" || sortOrder === "By Realease D") {
      sortedMovies = [...arr].sort((a, b) => {
        const dateA = new Date(a.release_date);
        const dateB = new Date(b.release_date);
        return sortOrder === "By Realease A" ? dateA - dateB : dateB - dateA;
      });
    } else {
      sortedMovies = [...arr];
    }

    fn(sortedMovies);
  };

  const handleGenreSelection = (genreId) => {
    fetchData(search, genreId);
  };

  const toggleRedP = (id) => {
    setRedP(id);
  };

  const toggleGenresPopup = () => {
    if (!genresPopup) {
      setGenresPopup(true);
    } else {
      setGenresPopup(false);
    }
  };

  const handleClick = () => {
    if (!isInputClicked) {
      setIsInputClicked(true);
    } else {
      setIsInputClicked(false);
    }
  };

  const searchMovies = (e) => {
    e.preventDefault();
    fetchData(search);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      fetchData(search);
    }
  };

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  return (
    <div className={styles.container} id="movies">
      <div className={styles.searchBox}>
        <div className={styles.inputContainer}>
          <h3 className={styles.firstSectionTittleH3}>DISCOVER MOVIES</h3>
          <div className={styles.searchFilterBox}>
            <div
              className={`${styles.inputBox} ${
                isInputClicked ? styles.inputClicked : ""
              }`}
            >
              <input
                className={styles.input}
                onKeyDown={handleKeyDown}
                onChange={(e) =>
                  setSearch(capitalizeFirstLetter(e.target.value))
                }
                onClick={handleClick}
                value={search}
                type="text"
                placeholder="Search"
              />
              <FontAwesomeIcon
                onClick={searchMovies}
                className={styles.icon}
                icon={faMagnifyingGlass}
              />
            </div>
            <select
              onChange={(e) => handleSort(e.target.value, movies, setMovies)}
              className={styles.filterBox}
            >
              <option>Filter</option>
              <option>By Popularity A</option>
              <option>By Popularity D</option>
              <option>By Realease A</option>
              <option>By Realease D</option>
            </select>
          </div>
        </div>
        <div className={styles.genresContainer}>
          <div onClick={toggleGenresPopup} className={styles.genresTitleBox}>
            <h4>GENRE</h4>
          </div>
          {genresPopup ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className={styles.genres}
            >
              {genres.map((item) => (
                <div
                  onClick={() => {
                    toggleRedP(item.id);
                    handleGenreSelection(item.id);
                  }}
                  className={redP === item.id ? styles.pBoxActive : styles.pBox}
                  key={item.id}
                >
                  <p>{item.name}</p>
                </div>
              ))}
            </motion.div>
          ) : (
            ""
          )}
        </div>
      </div>
      <div className={styles.movieBoxContainer}>
        <div className={styles.movieBox}>
          {movies.map((item) => (
            <Movie
              item={item}
              selectMovie={selectMovie}
              title={item.title}
              image={`https://image.tmdb.org/t/p/w500/${item.poster_path}`}
              key={item.id}
              year={item.release_date}
              backdrop={item.backdrop_path}
              description={item.overview}
              setLoginPopup={setLoginPopup}
              vote={item.vote_average.toFixed(1)}
              deleteShow={deleteShow}
              addedMovies={addedMovies}
            />
          ))}
          <div
            onClick={() => fetchMoreMovies(redP, search)}
            className={styles.outerBox}
          >
            <div className={styles.boxR}>
              <div className={styles.iconBox}>
                <FontAwesomeIcon className={styles.iconPlus} icon={faPlus} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.upencoming}>
        <div className={styles.searchBox}>
          <h3 className={styles.sectionTitleH3}>COMMING SOON</h3>
          <div className={styles.filter}>
            <select
              onChange={(e) =>
                handleSort(
                  e.target.value,
                  upencomingMovies,
                  setUpencomingMovies
                )
              }
              className={styles.filterBox}
            >
              <option>Filter</option>
              <option>By Popularity A</option>
              <option>By Popularity D</option>
              <option>By Realease A</option>
              <option>By Realease D</option>
            </select>
          </div>
        </div>
        <div className={styles.movieBox}>
          {upencomingMovies.map((item) => (
            <Movie
              item={item}
              selectMovie={selectMovie}
              title={item.title}
              image={`https://image.tmdb.org/t/p/w500/${item.poster_path}`}
              id={item.id}
              year={item.release_date}
              backdrop={item.backdrop_path}
              description={item.overview}
              key={item.id}
              vote={item.vote_average.toFixed(1)}
              setLoginPopup={setLoginPopup}
              deleteShow={deleteShow}
              addedMovies={addedMovies}
            />
          ))}
          <div onClick={fetchMoreUpcomingMovies} className={styles.outerBox}>
            <div className={styles.boxR}>
              <div className={styles.iconBox}>
                <FontAwesomeIcon className={styles.iconPlus} icon={faPlus} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.awardWinning}>
        <div className={styles.searchBox}>
          <h3 className={styles.sectionTitleH3}>AWARD-WINNING</h3>
          <div className={styles.filter}>
            <select
              onChange={(e) =>
                handleSort(
                  e.target.value,
                  awardWinningMovies,
                  setAwardWinningMovies
                )
              }
              className={styles.filterBox}
            >
              <option>Filter</option>
              <option>By Popularity A</option>
              <option>By Popularity D</option>
              <option>By Realease A</option>
              <option>By Realease D</option>
            </select>
          </div>
        </div>
        <div className={styles.movieBox}>
          {awardWinningMovies.map((item) => (
            <Movie
              item={item}
              selectMovie={selectMovie}
              title={item.title}
              image={`https://image.tmdb.org/t/p/w500/${item.poster_path}`}
              id={item.id}
              year={item.release_date}
              backdrop={item.backdrop_path}
              description={item.overview}
              key={item.id}
              vote={item.vote_average.toFixed(1)}
              setLoginPopup={setLoginPopup}
              deleteShow={deleteShow}
              addedMovies={addedMovies}
            />
          ))}
          <div
            onClick={fetchMoreAwardWinningMovies}
            className={styles.outerBox}
          >
            <div className={styles.boxR}>
              <div className={styles.iconBox}>
                <FontAwesomeIcon className={styles.iconPlus} icon={faPlus} />
              </div>
            </div>
          </div>
        </div>
      </div>
      {user ? (
        <div className={styles.favorites} id="favorites">
          <div className={styles.searchBox}>
            <h3 className={styles.sectionTitleH3}>FAVORITES</h3>
          </div>
          <div className={styles.movieBox}>
            {addedMovies.map((item, id) => (
              <FavoritesMovie
                key={item.id}
                selectMovie={selectMovie}
                item={item}
                deleteShow={deleteShow}
              />
            ))}
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default MoviesBox;
