import React, { useState } from "react";
import styles from "./MoviesBox.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import Movie from "./Movie";
import { toast } from "react-toastify";

const MoviesBox = ({ movies, fetchData, selectMovie }) => {
  const [search, setSearch] = useState("");
  const [isInputClicked, setIsInputClicked] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [isAddedToFavorites, setIsAddedToFavorites] = useState(false);

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

  const addToFavorites = (movie) => {
    const isMovieInFavorites = favorites.some(
      (favMovie) => favMovie.id === movie.id
    );

    if (!isMovieInFavorites) {
      const movieWithId = { ...movie, addedAt: Date.now() };
      setFavorites([...favorites, movieWithId]);
    }
    setIsAddedToFavorites(true);
  };

  const removeFromFavorites = (addedAt, title, e) => {
    e.stopPropagation();
    const updatedFavorites = favorites.filter(
      (movie) => movie.addedAt !== addedAt
    );
    setFavorites(updatedFavorites);
    toast.error(`${title} removed from Favorites`, {
      position: "bottom-left",
      autoClose: 2000,
      style: {
        background: "black",
        color: "white",
      },
    });
  };

  return (
    <div className={styles.container} id="movies">
      <div className={styles.searchBox}>
        <h3>OPENING THIS WEEK</h3>
        <div
          className={`${styles.inputBox} ${
            isInputClicked ? styles.inputClicked : ""
          }`}
        >
          <input
            className={styles.input}
            onKeyDown={handleKeyDown}
            onChange={(e) => setSearch(e.target.value)}
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
      </div>
      <div className={styles.movieBox}>
        {movies.map((item) => (
          <Movie
            addToFavorites={addToFavorites}
            item={item}
            selectMovie={selectMovie}
            title={item.title}
            image={`https://image.tmdb.org/t/p/w500/${item.poster_path}`}
            id={item.id}
            year={item.release_date}
            backdrop={item.backdrop_path}
            description={item.overview}
          />
        ))}
      </div>
      <div className={styles.favorites} id="favorites">
        <div className={styles.searchBox}>
          <h3>FAVORITES</h3>
        </div>
        <div className={styles.movieBox}>
          {favorites.map((item) => (
            <Movie
              addToFavorites={addToFavorites}
              item={item}
              selectMovie={selectMovie}
              title={item.title}
              image={`https://image.tmdb.org/t/p/w500/${item.poster_path}`}
              id={item.id}
              year={item.release_date}
              backdrop={item.backdrop_path}
              description={item.overview}
              isAddedToFavorites={isAddedToFavorites}
              removeFromFavorites={removeFromFavorites}
              key={item.addedAt}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MoviesBox;
