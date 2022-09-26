/* eslint-disable prettier/prettier */
import {
  SIGNUP,
  LOGIN,
  LOGOUT,
  USERLOGIN,
  UPDATE_PROFILE,
  UPDATE_USER,
  GET_LANGUAGES,
  GET_DESIGNATION,
  GET_SPECIALITY,
} from '../action_types';

const initialState = {
  isUser: false,
  user: {},
  languages: [],
  speciality: [],
  designation: [],
};

const AuthReducer = (state = initialState, action) => {
  switch (action.type) {
    case SIGNUP:
      state = {...state, user: action.payload};
      break;

    case LOGIN:
      state = {...state, user: action.payload};
      break;

    case USERLOGIN:
      if (action.payload) {
        state = {...state, isUser: action.payload};
      } else {
        // logout
        state = {...initialState};
      }
      break;

    case LOGOUT:
      state = {...state, user: action.payload};
      break;

    case UPDATE_PROFILE:
      console.log('AT UPDATE PROFILE USER=>', action.payload);
      state = {...state, user: action.payload};
      break;

    case UPDATE_USER:
      console.log('AT UPDATE_USER USER=>', action.payload);
      state = {...state, user: action.payload};
      break;
    case GET_LANGUAGES:
      state = {...state, languages: action.payload};
      break;
    case GET_DESIGNATION:
      state = {...state, designation: action.payload};
      break;
    case GET_SPECIALITY:
      state = {...state, speciality: action.payload};
      break;

    default:
      break;
  }
  return state;
};

export default AuthReducer;
