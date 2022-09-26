/* eslint-disable prettier/prettier */
import {Dispatch} from 'react';
import {DispatchProp} from 'react-redux';
import {ApiRequest} from '../../Config/config';
import APIs from './../../Config/APIs';
import {ChangePasswordProps} from '../../interface';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BearerHeaders} from '../../Config/config';
import {Alert} from 'react-native';
import {ContactUsFormProps} from '../../interface';

export default class ContactUsMiddleware {
  static submitContactUsForm({
    type,
    title,
    description,
    successCallBack,
    errorCallBack,
  }: ContactUsFormProps) {
    return async (dispatch: DispatchProp) => {
      try {
        let formdata = new FormData();
        formdata.append('type', type);
        formdata.append('title', title);
        formdata.append('description', description);

        let user: any = await AsyncStorage.getItem('@User');
        user = JSON.parse(user || '');

        console.log(user, formdata);
        let response = await ApiRequest.Post(
          APIs.ContactUs,
          formdata,
          BearerHeaders(user.token),
        );
        console.log(response);
        if (response) {
          Alert.alert('Alert', response?.msg);
          if (response.status === 'error') {
            errorCallBack();
            return;
          }
          if (response.status === 'success') {
            successCallBack();
            return;
          }
        }
        errorCallBack();
        return;
      } catch (err) {
        console.log('ERROR=>', err);
      }
    };
  }
}
