import { combineReducers } from "redux";
import { userSlice } from "../features/UserSlice";

const rootReducer = combineReducers({
  user: userSlice.reducer,
});

export default rootReducer;
