import { useEffect, useState } from "react";
import "./App.css";
import Header from "./components/Header";
import MoviesBox from "./components/MoviesBox";
import Navigation from "./components/Navigation";
import axios from "axios";
import ClimbingBoxLoader from "react-spinners/ClimbingBoxLoader";
import Auth from "./auth/Auth";
import { useDispatch, useSelector } from "react-redux";
import { auth } from "./firebase";
import { loginUser, setLoading } from "./features/UserSlice";

function App() {
  const user = useSelector((state) => state.data.user.user);
  const reduxLoading = useSelector((state) => state.data.user.isLoading);
  console.log(reduxLoading);
  const dispatch = useDispatch();

  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState({});
  const [isloading, setIsLoading] = useState(true);
  const API_KEY = "0fb32892fbff2e68de652d01e57adc0e ";
  const API_URL = "https://api.themoviedb.org/3";

  useEffect(() => {
    auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        dispatch(
          loginUser({
            uid: authUser.uid,
            username: authUser.displayName,
            email: authUser.email,
          })
        );
        dispatch(setLoading(false));
      } else {
        dispatch(setLoading(false));
        console.log("User is not logged in.");
      }
    });
  }, []);

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
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsLoading(false);
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
    setSelectedMovie(data);
  };

  return (
    <div className="App">
      {reduxLoading ? (
        <div className="loader-container">
          <ClimbingBoxLoader
            color={"#ff0000"}
            loading={isloading}
            size={40}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      ) : (
        <>
          {isloading ? (
            <div className="loader-container">
              <ClimbingBoxLoader
                color={"#ff0000"}
                loading={isloading}
                size={40}
                aria-label="Loading Spinner"
                data-testid="loader"
              />
            </div>
          ) : (
            <>
              {user ? (
                <>
                  <Navigation />
                  <Header selectedMovie={selectedMovie} movies={movies} />
                  <MoviesBox
                    selectMovie={selectMovie}
                    fetchData={fetchData}
                    movies={movies}
                  />
                </>
              ) : (
                <Auth />
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

export default App;
