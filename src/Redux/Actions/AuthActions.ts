/* eslint-disable prettier/prettier */
import {
  SIGNUP,
  LOGIN,
  LOGOUT,
  USERLOGIN,
  SOCIAL_LOGIN,
  UPDATE_PROFILE,
  GET_LANGUAGES,
  GET_DESIGNATION,
  GET_SPECIALITY,
} from '../action_types';

const AuthActions = {
  Signup: (data: any) => {
    return {
      type: SIGNUP,
      payload: data,
    };
  },

  Login: (data: any) => {
    return {
      type: LOGIN,
      payload: data,
    };
  },

  UserLogin: (data: any) => {
    return {
      type: USERLOGIN,
      payload: data,
    };
  },

  SocialLogin: (data: any) => {
    return {
      type: SOCIAL_LOGIN,
      payload: data,
    };
  },

  Logout: (data: any) => {
    return {
      type: LOGOUT,
      payload: data,
    };
  },

  UpdateProfile: (data: any) => {
    return {
      type: UPDATE_PROFILE,
      payload: data,
    };
  },
  GetLanguages: (data: any) => {
    return {
      type: GET_LANGUAGES,
      payload: data,
    };
  },
  GetSpeciality: (data: any) => {
    return {
      type: GET_SPECIALITY,
      payload: data,
    };
  },
  GetDesignation: (data: any) => {
    return {
      type: GET_DESIGNATION,
      payload: data,
    };
  },
};

export default AuthActions;
