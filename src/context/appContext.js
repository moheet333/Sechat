import axios from "axios";
import "../axios";
import React, { useContext, useEffect, useReducer } from "react";
import {
  SET_LOADING,
  REGISTER_USER_SUCCESS,
  REGISTER_USER_ERROR,
  SET_USER,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_ERROR,
} from "./actions";
import reducer from "./reducer";

const initialState = {
  username: null,
  isLoading: false,
  friends: [],
  showAlert: false,
  editItem: null,
  singleJobError: false,
  editComplete: false,
};

const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setLoading = () => {
    dispatch({ type: SET_LOADING });
  };

  const register = async (userInput) => {
    setLoading();
    try {
      const { data } = await axios.post(`/auth/register`, {
        ...userInput,
      });
      dispatch({ type: REGISTER_USER_SUCCESS, payload: data.user.username });
      localStorage.setItem(
        "user",
        JSON.stringify({ username: data.user.username, token: data.user.token })
      );
    } catch (error) {
      dispatch({ type: REGISTER_USER_ERROR });
    }
  };

  const login = async (userInput) => {
    setLoading();
    try {
      const { data } = await axios.post(`/auth/login`, {
        ...userInput,
      });
      dispatch({ type: LOGIN_USER_SUCCESS, payload: data.user.username });
      localStorage.setItem(
        "user",
        JSON.stringify({ username: data.user.username, token: data.user.token })
      );
    } catch (error) {
      dispatch({ type: LOGIN_USER_ERROR });
    }
  };

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const newUser = JSON.parse(user);
      dispatch({ type: SET_USER, payload: newUser.username });
    }
  }, []);

  return (
    <AppContext.Provider
      value={{
        ...state,
        setLoading,
        register,
        login,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(AppContext);
};

export { AppProvider };
