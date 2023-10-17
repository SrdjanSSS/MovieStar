import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  items: [],
  status: null,
  error: null,
};

export const fetchMovies = createAsyncThunk("movie/fetchMovies", async () => {
  const response = await axios.get(
    "http://www.omdbapi.com/?s=Harry Potter&apikey=9fb8a7d7"
  );
  return response?.data;
});

const movieSlice = createSlice({
  name: "movie",
  initialState,
  reducers: {},
});

export default movieSlice.reducer;
