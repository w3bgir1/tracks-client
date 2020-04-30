import { AsyncStorage } from "react-native";
import createDataContext from "./createDataContext";
import trackerApi from "../api/tracker";
import { navigate } from "../navigationRef";

const ADD_ERROR = "ADD_ERROR";
const SIGNUP = "SIGNUP";

const authReducer = (state, { type, payload }) => {
  switch (type) {
    case ADD_ERROR:
      return { ...state, errorMessage: payload };
    case SIGNUP:
      return { errorMessage: "", token: payload };
    default:
      return state;
  }
};

const signup = (dispatch) => async ({ email, password }) => {
  try {
    const response = await trackerApi.post("/signup", { email, password });
    await AsyncStorage.setItem("token", response.data.token);
    dispatch({ type: SIGNUP, payload: response.data.token });
    navigate("TrackList");
  } catch (err) {
    dispatch({
      type: ADD_ERROR,
      payload: "Something went wrong with sign up",
    });
  }
};

const signin = (dispatch) => {
  return ({ email, password }) => {};
};

const signout = (dispatch) => {
  return () => {};
};
export const { Provider, Context } = createDataContext(
  authReducer,
  { signup, signin, signout },
  { token: null, errorMessage: "" }
);
