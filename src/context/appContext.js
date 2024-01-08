import axios from "axios";
import "../axios";
import React, { useContext, useReducer } from "react";
import {
  SET_LOADING,
  REGISTER_USER_SUCCESS,
  REGISTER_USER_ERROR,
} from "./actions";
import reducer from "./reducer";

const initialState = {
  user: null,
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

      dispatch({ type: REGISTER_USER_SUCCESS, payload: data.user.name });
      localStorage.setItem(
        "user",
        JSON.stringify({ name: data.user.name, token: data.token })
      );
    } catch (error) {
      dispatch({ type: REGISTER_USER_ERROR });
    }
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        setLoading,
        register,
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
