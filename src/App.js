import { useEffect, useState } from "react";
import "./App.css";
import Header from "./components/Header";
import MoviesBox from "./components/MoviesBox";
import Navigation from "./components/Navigation";
import axios from "axios";
import ClimbingBoxLoader from "react-spinners/ClimbingBoxLoader";

function App() {
  const [movies, setMovies] = useState("");
  const [selectedMovie, setSelectedMovie] = useState({});
  const [loading, setLoading] = useState(true);
  const API_KEY = "0fb32892fbff2e68de652d01e57adc0e ";
  const API_URL = "https://api.themoviedb.org/3";

  const fetchData = async (searchKey) => {
    try {
      const type = searchKey ? "search" : "discover";
      const {
        data: { results },
      } = await axios.get(
        `https://api.themoviedb.org/3/${type}/movie?api_key=0fb32892fbff2e68de652d01e57adc0e`,
        {
          params: {
            api_key: API_KEY,
            query: searchKey,
          },
        }
      );
      await selectMovie(results[0]);
      setMovies(results);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchVideo = async (id) => {
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/movie/${id}?api_key=0fb32892fbff2e68de652d01e57adc0e`,
      {
        params: {
          api_key: API_KEY,
          append_to_response: "videos",
        },
      }
    );
    return data;
  };

  const selectMovie = async (movie) => {
    const data = await fetchVideo(movie.id);
    console.log("MOVIE DATA", data);
    setSelectedMovie(data);
  };

  console.log("MOVIES", movies);
  console.log("SELECTED MOVIE", selectedMovie);

  return (
    <div className="App">
      {loading ? (
        <div className="loader-container">
          <ClimbingBoxLoader
            color={"#ff0000"}
            loading={loading}
            size={40}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      ) : (
        <>
          <Navigation />
          <Header selectedMovie={selectedMovie} movies={movies} />
          <MoviesBox
            selectMovie={selectMovie}
            fetchData={fetchData}
            movies={movies}
          />
        </>
      )}
    </div>
  );
}

export default App;
