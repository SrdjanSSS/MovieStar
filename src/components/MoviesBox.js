import React, { useState } from "react";
import styles from "./MoviesBox.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import Movie from "./Movie";

const MoviesBox = ({ movies, fetchData, selectMovie }) => {
  const [search, setSearch] = useState("");

  const searchMovies = (e) => {
    e.preventDefault();
    fetchData(search);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      fetchData(search);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.searchBox}>
        <h3>OPENING THIS WEEK</h3>
        <div className={styles.inputBox}>
          <input
            onKeyDown={handleKeyDown}
            onChange={(e) => setSearch(e.target.value)}
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
      <div className={styles.commingSoon}>
        <div className={styles.searchBox}>
          <h3>FAVORITES</h3>
        </div>
      </div>
    </div>
  );
};

export default MoviesBox;
