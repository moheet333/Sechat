import {
  SET_LOADING,
  REGISTER_USER_SUCCESS,
  REGISTER_USER_ERROR,
  SET_USER,
  LOGIN_USER_ERROR,
  LOGIN_USER_SUCCESS,
  SEARCH_USER_SUCCESS,
  SEARCH_USER_ERROR,
  GET_CHAT_SUCCESS,
  GET_CHAT_ERROR,
} from "./actions";

const reducer = (state, action) => {
  if (action.type === SEARCH_USER_SUCCESS) {
    return {
      ...state,
      isLoading: false,
      searchNewUsers: action.payload,
      showAlert: false,
    };
  }

  if (action.type === SEARCH_USER_ERROR) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
    };
  }

  if (action.type === SET_LOADING) {
    return {
      ...state,
      isLoading: true,
      showAlert: false,
    };
  }
  if (action.type === REGISTER_USER_SUCCESS) {
    return {
      ...state,
      isLoading: false,
      showAlert: false,
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
      showAlert: false,
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

  if (action.type === GET_CHAT_SUCCESS) {
    return {
      ...state,
      isLoading: false,
      chat: action.payload,
      showAlert: false,
    };
  }

  if (action.type === GET_CHAT_ERROR) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      chat: [],
    };
  }

  if (action.type === SET_USER) {
    return {
      ...state,
      isLoading: false,
      user: action.payload,
    };
  }

  throw new Error(`no such action : ${action}`);
};

export default reducer;
