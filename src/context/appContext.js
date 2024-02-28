import axios from "axios";
import "../axios";
import React, { useContext, useState, useEffect, useReducer } from "react";
import {
  SET_LOADING,
  REGISTER_USER_SUCCESS,
  REGISTER_USER_ERROR,
  SET_USER,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_ERROR,
  SEARCH_USER_ERROR,
  SEARCH_USER_SUCCESS,
} from "./actions";
import reducer from "./reducer";

const initialState = {
  user: null,
  isLoading: false,
  searchNewUsers: [],
  showAlert: false,
  editItem: null,
  singleJobError: false,
  editComplete: false,
};

export const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authCheckComplete, setAuthCheckComplete] = useState(false);

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
        JSON.stringify({
          username: data.user.username,
          id: data.user.userId,
          token: data.user.token,
        })
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
        JSON.stringify({
          username: data.user.username,
          id: data.user.userId,
          token: data.user.token,
        })
      );
    } catch (error) {
      dispatch({ type: LOGIN_USER_ERROR });
    }
  };

  const searchUsers = async (userInput) => {
    if (userInput.searchUser === "") {
      dispatch({ type: SEARCH_USER_SUCCESS, payload: [] });
      return;
    }
    setLoading();
    try {
      const { data } = await axios.post("/user/searchUsers", {
        ...userInput,
      });
      dispatch({ type: SEARCH_USER_SUCCESS, payload: data.users });
    } catch (error) {
      dispatch({ type: SEARCH_USER_ERROR });
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      setLoading();
      const user = localStorage.getItem("user");
      if (user) {
        try {
          const newUser = JSON.parse(user);
          dispatch({ type: SET_USER, payload: newUser });
          setIsAuthenticated(true);
        } catch (error) {
          dispatch({ type: SET_USER, payload: null });
          setIsAuthenticated(false);
        }
      } else {
        dispatch({ type: SET_USER, payload: null });
        setIsAuthenticated(false);
      }
      setAuthCheckComplete(true);
    };

    const checkAuthStatus = async () => {
      setLoading();
      const token = localStorage.getItem("user");
      if (token) {
        try {
          const newUser = JSON.parse(token);
          dispatch({ type: SET_USER, payload: newUser });
          setIsAuthenticated(true);
        } catch (error) {
          dispatch({ type: SET_USER, payload: null });
          setIsAuthenticated(false);
        }
      } else {
        dispatch({ type: SET_USER, payload: null });
        setIsAuthenticated(false);
      }
      setAuthCheckComplete(true);
    };

    fetchUser();
    checkAuthStatus();
  }, []);

  if (!authCheckComplete) {
    return <div>Loading...</div>;
  }

  return (
    <AppContext.Provider
      value={{
        ...state,
        setLoading,
        register,
        isAuthenticated,
        login,
        searchUsers,
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
