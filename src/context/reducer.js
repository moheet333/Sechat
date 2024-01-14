import {
  SET_LOADING,
  REGISTER_USER_SUCCESS,
  REGISTER_USER_ERROR,
  SET_USER,
  LOGIN_USER_ERROR,
  LOGIN_USER_SUCCESS,
} from "./actions";

const reducer = (state, action) => {
  if (action.type === SET_LOADING) {
    return {
      ...state,
      isLoading: true,
      showAlert: false,
      editComplete: false,
    };
  }
  if (action.type === REGISTER_USER_SUCCESS) {
    return {
      ...state,
      isLoading: false,
      user: action.payload,
    };
  }
  if (action.type === REGISTER_USER_ERROR) {
    return {
      ...state,
      isLoading: false,
      user: null,
      showAlert: true,
    };
  }

  if (action.type === LOGIN_USER_SUCCESS) {
    return {
      ...state,
      isLoading: false,
      user: action.payload,
    };
  }

  if (action.type === LOGIN_USER_ERROR) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      user: null,
    };
  }

  if (action.type === SET_USER) {
    return {
      ...state,
      username: action.payload,
    };
  }

  throw new Error(`no such action : ${action}`);
};

export default reducer;
