/* eslint-disable prettier/prettier */
import {ApiRequest, BearerHeaders} from '../../Config/config';
import APIs from './../../Config/APIs';
import {LoginManager, Profile} from 'react-native-fbsdk-next';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
// import { Alert, AsyncStorage } from 'react-native';
import {Alert} from 'react-native';
import AuthActions from '../Actions/AuthActions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NavigationServices from '../../Navigation/NavigationServices';
import {Dispatch} from 'react';
import {DispatchActionType} from '../../interface';

import LoaderAction from '../Actions/LoaderAction';
import {Toast} from 'native-base';

export default class AuthMiddleware {
  static Signup({
    f_name,
    l_name,
    email,
    password,
    phone_no,
    license_no,
    countryId,
    stateId,
    cityId,
    experience,
    expertise,
    callback,
    checked,
    selectedDesignationIds,
    selectedLanguagesIds,
    selectedSpecialityIds,
  }: any) {
    return async (dispatch: any) => {
      dispatch(LoaderAction.LoaderTrue());
      try {
        let formdata = new FormData();
        formdata.append('f_name', f_name);
        formdata.append('l_name', l_name);
        formdata.append('email', email);
        formdata.append('password', password);
        formdata.append('phone', phone_no);
        formdata.append('license_num', license_no);
        formdata.append('country_id', countryId);
        if (stateId) formdata.append('state_id', stateId);
        if (cityId) formdata.append('city_id', cityId);
        // For Languages
        if (selectedLanguagesIds.length > 0) {
          for (let i = 0; i < selectedLanguagesIds.length; i++) {
            formdata.append('language_ids[]', selectedLanguagesIds[i]);
          }
        }
        // For Designation
        if (selectedDesignationIds.length > 0) {
          for (let i = 0; i < selectedDesignationIds.length; i++) {
            formdata.append('designation_ids[]', selectedDesignationIds[i]);
          }
        }
        // For Speciality
        if (selectedSpecialityIds.length > 0) {
          for (let i = 0; i < selectedSpecialityIds.length; i++) {
            formdata.append('speciality_ids[]', selectedSpecialityIds[i]);
          }
        }

        formdata.append('experience', experience);
        formdata.append('expertise', expertise);

        if (checked) {
          let response = await ApiRequest.Post(APIs.Signup, formdata, {});
          dispatch(LoaderAction.LoaderFalse());
          console.log('response SIGNUP', response);
          if (response.status == 'success') {
            callback(response.realtor);
          } else {
            callback(false);
            Alert.alert('Alert', response.msg);
          }
        } else {
          dispatch(LoaderAction.LoaderFalse());
          Alert.alert('Error', 'Accept the terms and condition');
        }
      } catch (err) {
        dispatch(LoaderAction.LoaderFalse());
        callback(false);
        console.error(err);
      }
    };
  }

  static Login({email, password, device_token, callback}: any) {
    return async (dispatch: any) => {
      dispatch(LoaderAction.LoaderTrue());
      try {
        let formdata = new FormData();
        formdata.append('email', email);
        formdata.append('password', password);
        formdata.append('device_id', device_token);

        let response = await ApiRequest.Post(APIs.Login, formdata, {});
        dispatch(LoaderAction.LoaderFalse());
        if (response.status == 'success') {
          AsyncStorage.setItem('@User', JSON.stringify(response.data));
          dispatch(AuthActions.Login(response.data));
          dispatch(AuthActions.UserLogin(true));
          callback(response.data);
        } else {
          callback(false);
          Alert.alert('Error', response.msg);
        }
      } catch (err) {
        callback(false);
        console.warn(err);
      }
    };
  }

  static SocialLogin({f_name, l_name, email, type}: any) {
    return async (dispatch: any) => {
      dispatch(LoaderAction.LoaderTrue());
      try {
        let formdata = new FormData();
        formdata.append('f_name', f_name);
        formdata.append('l_name', l_name);
        formdata.append('email', email);
        formdata.append('type', type); // platform google ||  facebook
        let response = await ApiRequest.Post(APIs.SocialLogin, formdata, {});
        dispatch(LoaderAction.LoaderFalse());
        console.log('Social Login middleware', response);
        if (response?.status == 'success') {
          AsyncStorage.setItem('@User', JSON.stringify(response.data));
          dispatch(AuthActions.Login(response.data));
          dispatch(AuthActions.UserLogin(true));
        } else if (response?.status === 'error') {
          Toast.show({
            title: 'Error',
            status: 'error',
            description: `${response.msg}`,
            placement: 'bottom-left',
            duration: 3000,
          });
          // Alert.alert('Error', response.msg);
        }
      } catch (err) {
        console.log(err);
      }
    };
  }

  static ForgotPassword({resetEmail, callback}) {
    return async dispatch => {
      try {
        let formData = new FormData();

        formData.append('email', resetEmail);
        let response = await ApiRequest.Post(APIs.ForgotPassword, formData, {});
        if (response.success == true) {
          callback(response);
        } else {
          callback(false);
          Alert.alert('Error', response.msg);
        }
      } catch (error) {
        callback(false);
        console.warn(error);
      }
    };
  }

  static UpdateProfile({
    token,
    imgObj,
    f_name,
    l_name,
    email,
    license_num,
    phone,
    address,
    countryId,
    stateId,
    cityId,
    insta_link,
    linkedin_link,
    fb_link,
    about,
    experience,
    expertise,
    lat,
    lng,
    callback,
    selectedLanguagesIds,
    selectedDesignationIds,
    selectedSpecialityIds,
  }: any) {
    return async (dispatch: any) => {
      console.log('DISPATCH');
      dispatch(LoaderAction.LoaderTrue());
      try {
        let userToken = BearerHeaders(token);
        let formdata = new FormData();
        formdata.append('image', imgObj);
        formdata.append('f_name', f_name);
        formdata.append('l_name', l_name);
        formdata.append('email', email);
        formdata.append('phone', phone);
        formdata.append('license_num', license_num);
        formdata.append('address', address);
        formdata.append('country_id', countryId);
        formdata.append('state_id', stateId);
        if (cityId) formdata.append('city_id', cityId);
        // For Languages
        if (selectedLanguagesIds?.length > 0) {
          for (let i = 0; i < selectedLanguagesIds.length; i++) {
            formdata.append('language_ids[]', selectedLanguagesIds[i]);
          }
        }
        // For Designation
        if (selectedDesignationIds?.length > 0) {
          for (let i = 0; i < selectedDesignationIds.length; i++) {
            formdata.append('designation_ids[]', selectedDesignationIds[i]);
          }
        }
        // For Speciality
        if (selectedSpecialityIds?.length > 0) {
          for (let i = 0; i < selectedSpecialityIds.length; i++) {
            formdata.append('speciality_ids[]', selectedSpecialityIds[i]);
          }
        }

        formdata.append('insta_link', insta_link);
        formdata.append('linkedin_link', linkedin_link);
        formdata.append('fb_link', fb_link);
        formdata.append('about', about);
        formdata.append('experience', experience);
        formdata.append('expertise', expertise);
        formdata.append('lat', lat);
        formdata.append('lng', lng);

        let response = await ApiRequest.Post(
          APIs.EditProfile,
          formdata,
          userToken,
        );

        dispatch(LoaderAction.LoaderFalse());
        console.log('response.realtor', response.realtor);
        console.log('formdata.realtor', formdata);
        if (response.status == 'success') {
          dispatch(AuthActions.UpdateProfile({token, user: response.realtor}));
          AsyncStorage.setItem(
            '@User',
            JSON.stringify({token, user: response.realtor}),
          );
          callback(response);
        } else {
          callback(false);
          // Alert.alert('Error', response[1]);
          // Toast.show({
          //   title: 'Alert',
          //   status: 'warning',
          //   description: `${response[1]}`,
          //   placement: 'bottom-left',
          //   duration: 3000,
          // });
        }
      } catch (err) {
        console.error('edit catch run', err);
      }
    };
  }

  static GetUserData({token, userId, callback}: any) {
    return async (dispatch: any) => {
      try {
        let userToken = BearerHeaders(token);
        let response = await ApiRequest.Get(
          `${APIs.GetUserData}/${userId}`,
          userToken,
        );
        console.warn('response.data.realtors', response.data.realtors);
        if (response.success) {
          callback && callback(true);
          AsyncStorage.setItem(
            '@UserData',
            JSON.stringify(response.data.realtors),
          );
        }
      } catch (error) {
        callback && callback(false);
        console.warn(error);
      }
    };
  }

  static getUpdatedUser = ({callback}) => {
    console.log(callback);
    return async (dispatch: any) => {
      try {
        let user = await AsyncStorage.getItem('@User');
        user = JSON.parse(user);

        let headers = BearerHeaders(user.token);
        console.log('headers', headers);

        let response = await ApiRequest.Post(
          `${APIs.getUpdatedUser}`,
          {},
          headers,
        );
        if (response?.status == 'success') {
          dispatch(AuthActions.Login({token: user.token, user: response.data}));
          AsyncStorage.setItem(
            '@User',
            JSON.stringify({token: user.token, user: response.data}),
          );
          callback && callback();
        }
        console.log('RESPONSE =>>>>>>>>>', response);
      } catch (error) {
        console.warn(error);
      }
    };
  };
  static getAppContent = ({callBack}) => {
    return async (dispatch: any) => {
      try {
        let response = await ApiRequest.Get(`${APIs.termsAndCondition}`);

        callBack(response.data.terms.terms_cond);
      } catch (error) {
        console.warn(error);
      }
    };
  };

  static getLanguages = () => {
    return async (dispatch: any) => {
      try {
        let response = await ApiRequest.Get(`${APIs.languages}`);
        dispatch(AuthActions.GetLanguages(response.data.languages));
      } catch (error) {
        console.warn(error);
      }
    };
  };

  static getSpeciality = () => {
    return async (dispatch: any) => {
      try {
        let response = await ApiRequest.Get(`${APIs.speciality}`);
        dispatch(AuthActions.GetSpeciality(response.data.specialities));
      } catch (error) {
        console.warn(error);
      }
    };
  };

  static getDesignation = () => {
    return async (dispatch: any) => {
      try {
        let response = await ApiRequest.Get(`${APIs.designation}`);
        dispatch(AuthActions.GetDesignation(response.data.designations));
      } catch (error) {
        console.warn(error);
      }
    };
  };
}
