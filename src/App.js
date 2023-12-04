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
import { Routes, Route } from "react-router-dom";
import pageTitle from "./images/pageTitle2.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmarkSquare } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

function App() {
  const reduxLoading = useSelector((state) => state.data.user.isLoading);
  const dispatch = useDispatch();

  const [movies, setMovies] = useState([]);
  const [awardWinningMovies, setAwardWinningMovies] = useState([]);
  const [upencomingMovies, setUpencomingMovies] = useState([]);
  const [upcomingPageNumber, setUpcomingPageNumber] = useState(1);
  const [isLoadingMoreUpcomingMovies, setIsLoadingMoreUpcomingMovies] =
    useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [isLoadingMoreMovies, setIsLoadingMoreMovies] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState({});
  const [isloading, setIsLoading] = useState(true);
  const [loginPopup, setLoginPopup] = useState(false);
  const [genres, setGenres] = useState("");
  const API_KEY = "0fb32892fbff2e68de652d01e57adc0e";
  const BASE_URL = "https://api.themoviedb.org/3";

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
      }
    });
  }, []);

  const fetchMoreAwardWinningMovies = async () => {
    if (isLoadingMoreMovies) {
      return;
    }

    setIsLoadingMoreMovies(true);

    try {
      const nextPage = pageNumber + 1;
      const {
        data: { results: newMovies },
      } = await axios.get(
        `https://api.themoviedb.org/3/discover/movie?api_key=0fb32892fbff2e68de652d01e57adc0e&sort_by=popularity.desc&with_awards=true&page=${nextPage}`
      );

      setAwardWinningMovies((prevMovies) => [...prevMovies, ...newMovies]);
      setPageNumber(nextPage);
    } catch (error) {
      console.error("Error fetching more award-winning movies:", error);
    } finally {
      setIsLoadingMoreMovies(false);
    }
  };

  const fetchAwardWinningMovies = async () => {
    try {
      const response = await axios.get(
        "https://api.themoviedb.org/3/discover/movie?api_key=0fb32892fbff2e68de652d01e57adc0e&sort_by=popularity.desc&with_awards=true",
        {
          params: {
            api_key: "YOUR_API_KEY",
            sort_by: "popularity.desc",
            with_awards: true,
          },
        }
      );

      const awardMovies = response.data.results;
      setAwardWinningMovies(awardMovies);
    } catch (error) {
      console.error("Error fetching award-winning movies:", error);
    }
  };

  const fetchUpencomingMovies = async () => {
    try {
      const {
        data: { results: upcomingMoviesData },
      } = await axios.get(
        `${BASE_URL}/movie/upcoming?api_key=${API_KEY}&language=en-US&page=1`
      );

      const filteredUpcomingMovies = upcomingMoviesData.filter(
        (movie) => new Date(movie.release_date) > new Date()
      );

      setUpencomingMovies(filteredUpcomingMovies);
    } catch (error) {
      console.error("Error fetching upcoming movies:", error);
    }
  };

  const fetchData = async (searchKey, genreId, page = 1) => {
    try {
      if (searchKey) {
      }
      const type = searchKey ? "search" : "discover";
      const {
        data: { results },
      } = await axios.get(
        `https://api.themoviedb.org/3/${type}/movie?api_key=0fb32892fbff2e68de652d01e57adc0e`,
        {
          params: {
            api_key: API_KEY,
            query: searchKey,
            with_genres: genreId,
            sort_by: "popularity.desc",
            page: page,
          },
        }
      );
      if (results.length > 0) {
        await selectMovie(results[0]);
      }
      setMovies(results);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    fetchGenres();
    fetchUpencomingMovies();
    fetchAwardWinningMovies();
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

  const fetchMoreUpcomingMovies = async () => {
    if (isLoadingMoreUpcomingMovies) {
      return;
    }

    setIsLoadingMoreUpcomingMovies(true);

    try {
      const nextUpcomingPage = upcomingPageNumber + 1;
      const {
        data: { results: newUpcomingMovies },
      } = await axios.get(
        `${BASE_URL}/movie/upcoming?api_key=${API_KEY}&language=en-US&page=${nextUpcomingPage}`
      );

      const filteredUpcomingMovies = newUpcomingMovies.filter(
        (movie) => new Date(movie.release_date) > new Date()
      );

      setUpencomingMovies((prevMovies) => [
        ...prevMovies,
        ...filteredUpcomingMovies,
      ]);
      setUpcomingPageNumber(nextUpcomingPage);
    } catch (error) {
      console.error("Error fetching more upcoming movies:", error);
    } finally {
      setIsLoadingMoreUpcomingMovies(false);
    }
  };

  const fetchMoreMovies = async (genreId, searchKey) => {
    if (isLoadingMoreMovies) {
      return;
    }

    setIsLoadingMoreMovies(true);

    try {
      const nextPage = pageNumber + 1;
      const {
        data: { results: newMovies },
      } = await axios.get(
        `https://api.themoviedb.org/3/discover/movie?api_key=0fb32892fbff2e68de652d01e57adc0e`,
        {
          params: {
            api_key: API_KEY,
            page: nextPage,
            with_genres: genreId,
            query: searchKey,
          },
        }
      );
      setMovies((prevMovies) => [...prevMovies, ...newMovies]);
      setPageNumber(nextPage);
    } catch (error) {
      console.error("Error fetching more movies:", error);
    } finally {
      setIsLoadingMoreMovies(false);
    }
  };

  const fetchGenres = async () => {
    const { data } = await axios.get(
      "https://api.themoviedb.org/3/genre/movie/list?api_key=0fb32892fbff2e68de652d01e57adc0e"
    );

    setGenres(data.genres);
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
              <Routes>
                <Route
                  path="/"
                  element={
                    <>
                      <Navigation setLoginPopup={setLoginPopup} />
                      <Header
                        setLoginPopup={setLoginPopup}
                        selectedMovie={selectedMovie}
                        movies={movies}
                      />
                      <MoviesBox
                        setAwardWinningMovies={setAwardWinningMovies}
                        setUpencomingMovies={setUpencomingMovies}
                        fetchMoreAwardWinningMovies={
                          fetchMoreAwardWinningMovies
                        }
                        awardWinningMovies={awardWinningMovies}
                        fetchMoreUpcomingMovies={fetchMoreUpcomingMovies}
                        upencomingMovies={upencomingMovies}
                        setMovies={setMovies}
                        fetchMoreMovies={fetchMoreMovies}
                        setLoginPopup={setLoginPopup}
                        selectMovie={selectMovie}
                        fetchData={fetchData}
                        movies={movies}
                        genres={genres}
                      />
                      {loginPopup ? (
                        <>
                          <div className="background-overlay"></div>
                          <div className="login-popup-container">
                            <FontAwesomeIcon
                              className="icon"
                              icon={faXmarkSquare}
                              onClick={() => setLoginPopup(false)}
                            />
                            <div className="login-popup-box">
                              <img
                                className="title-img"
                                src={pageTitle}
                                alt=""
                              />
                              <h2>Log In or Create Account</h2>
                              <h3>
                                Log in to add movies to your favorite watchlist,
                                watch trailers and more! New here? Create a Star
                                Movies account.
                              </h3>
                              <div className="btn-box">
                                <Link to="/auth">
                                  <button onClick={() => setLoginPopup(false)}>
                                    Sing In
                                  </button>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (
                        ""
                      )}
                    </>
                  }
                />
                <Route path="/auth" element={<Auth />} />
              </Routes>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default App;
