/* eslint-disable prettier/prettier */
import {Dispatch} from 'react';
import {DispatchProp} from 'react-redux';
import {ApiRequest} from '../../Config/config';
import APIs from './../../Config/APIs';
import {ChangePasswordProps} from '../../interface';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BearerHeaders} from '../../Config/config';
import {Alert} from 'react-native';
import RealtorAction from '../Actions/RelatorAction';
import store from '../store';
import AuthActions from '../Actions/AuthActions';
export default class ProfileMiddleware {
  static ChangePassword({
    old_password,
    password,
    confirm_password,
    successCallBack,
    errorCallBack,
  }: ChangePasswordProps) {
    return async (dispatch: DispatchProp) => {
      try {
        let formdata = new FormData();
        formdata.append('old_password', old_password);
        formdata.append('password', password);
        formdata.append('confirm_password', confirm_password);

        let user: any = await AsyncStorage.getItem('@User');
        user = JSON.parse(user || '');

        let response = await ApiRequest.Post(
          APIs.ChangePassword(user.user.id),
          formdata,
          BearerHeaders(user.token),
        );
        Alert.alert('Alert', response.msg);
        if (response.status === 'error') {
          errorCallBack();
          return;
        }
        if (response.status === 'success') {
          successCallBack();
          return;
        }
        return;
      } catch (err) {
        console.log('ERROR=>', err);
      }
    };
  }

  static notify({is_notify}: ChangePasswordProps) {
    return async (dispatch: DispatchProp) => {
      try {
        let formdata = new FormData();
        formdata.append('is_notify', is_notify);

        let user: any = await AsyncStorage.getItem('@User');
        user = JSON.parse(user || '');
        user.user.is_notify = is_notify;

        let response = await ApiRequest.Post(
          APIs.notify,
          formdata,
          BearerHeaders(user.token),
        );

        if (response.success) {
          dispatch(AuthActions.UpdateProfile(user));
          await AsyncStorage.setItem('@User', JSON.stringify(user));
        }
      } catch (err) {
        console.log('ERROR=>', err);
      }
    };
  }

  static EmptyRealtors = () => {
    return (dispatch: any) => {
      dispatch(RealtorAction.Realtor([]));
    };
  };

  static GetRealtors({
    token,
    updateCountryId,
    updateStateId,
    updateCityId,
    full_name,
    experience,
    speciality,
    callback,
    selectedLanguagesIds,
    selectedSpecialityIds,
    selectedDesignationIds,
    page = 1,
    realtors,
  }: any) {
    return async (dispatch: any) => {
      try {
        if (page && page == 1) {
          dispatch(RealtorAction.Realtor([]));
        }
        let BearerHeader = BearerHeaders(token);
        console.log(token);
        let formData = new FormData();
        formData.append('country_id', updateCountryId); //updateCountryId);
        if (updateStateId) formData.append('state_id', updateStateId); //updateStateId);
        if (updateCityId) formData.append('city_id', updateCityId); //updateCityId);
        if (full_name) formData.append('full_name', full_name);
        if (experience) formData.append('experience', experience);
        if (selectedLanguagesIds?.length > 0) {
          for (let i = 0; i < selectedLanguagesIds.length; i++) {
            formData.append('language_id[]', selectedLanguagesIds[i]);
          }
        }
        console.log('117=>', formData);

        if (selectedSpecialityIds?.length > 0) {
          for (let i = 0; i < selectedSpecialityIds.length; i++) {
            formData.append('speciality_id[]', selectedSpecialityIds[i]);
          }
        }
        if (selectedDesignationIds?.length > 0) {
          for (let i = 0; i < selectedDesignationIds.length; i++) {
            formData.append('designation_id[]', selectedDesignationIds[i]);
          }
        }

        console.log('FORM DATA+===', formData, page);
        // return;

        let response = await ApiRequest.Post(
          `${APIs.GetRelators}?page=${page}`,
          formData,
          BearerHeader,
        );
        console.warn('ress', response);

        if (response?.status == 'success') {
          dispatch(
            RealtorAction.Realtor([...realtors, ...response.users.data]),
          );
          callback(response.users);
        } else {
          callback(false);
        }
      } catch (err) {
        callback(false);
      }
    };
  }

  static Logout({token}) {
    return async dispatch => {
      try {
        let bearerHeader = BearerHeaders(token);
        let response = await ApiRequest.Get(APIs.Logout, bearerHeader);
        console.warn(response);
      } catch (error) {
        console.warn(error);
      }
    };
  }
}
