import { AsyncStorage } from "react-native";
import createDataContext from "./createDataContext";
import trackerApi from "../api/tracker";
import { navigate } from "../navigationRef";

const ADD_ERROR = "ADD_ERROR";
const SIGNIN = "SIGNIN";
const SIGNOUT = "SIGNOUT";
const CLEAR_ERROR_MESSAGE = "CLEAR_ERROR_MESSAGE";

const authReducer = (state, { type, payload }) => {
  switch (type) {
    case ADD_ERROR:
      return { ...state, errorMessage: payload };
    case CLEAR_ERROR_MESSAGE:
      return { ...state, errorMessage: "" };
    case SIGNIN:
      return { errorMessage: "", token: payload };
    case SIGNOUT:
      return { token: null, errorMessage: "" };
    default:
      return state;
  }
};

const tryLocalSignin = (dispatch) => async () => {
  const token = await AsyncStorage.getItem("token");

  if (token) {
    dispatch({ type: SIGNIN, payload: token });
    navigate("TrackList");
  } else {
    navigate("Signup");
  }
};

const clearErrorMessage = (dispatch) => () =>
  dispatch({ type: CLEAR_ERROR_MESSAGE });

const signup = (dispatch) => async ({ email, password }) => {
  try {
    const response = await trackerApi.post("/signup", { email, password });
    await AsyncStorage.setItem("token", response.data.token);
    dispatch({ type: SIGNIN, payload: response.data.token });
    navigate("TrackList");
  } catch (err) {
    dispatch({
      type: ADD_ERROR,
      payload: "Something went wrong with sign up",
    });
  }
};

const signin = (dispatch) => async ({ email, password }) => {
  try {
    const response = await trackerApi.post("/signin", { email, password });
    await AsyncStorage.setItem("token", response.data.token);
    dispatch({ type: SIGNIN, payload: response.data.token });
    navigate("TrackList");
  } catch (err) {
    dispatch({
      type: ADD_ERROR,
      payload: "Something went wrong with sign in",
    });
  }
};

const signout = (dispatch) => async () => {
  await AsyncStorage.removeItem("token");
  dispatch({ type: SIGNOUT });
  navigate("loginFlow");
};

export const { Provider, Context } = createDataContext(
  authReducer,
  { signup, signin, signout, clearErrorMessage, tryLocalSignin },
  { token: null, errorMessage: "" }
);
