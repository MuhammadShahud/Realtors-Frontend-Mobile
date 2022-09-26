import {Dispatch} from 'react';
import {DispatchProp} from 'react-redux';
import {ApiRequest} from '../../Config/config';
import APIs from './../../Config/APIs';
import {ChangePasswordProps} from '../../interface';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BearerHeaders} from '../../Config/config';
import {Alert} from 'react-native';
import {ContactUsFormProps} from '../../interface';
import NotificationAction from '../Actions/NotificationAction';
import {DispatchActionType} from '../../interface';

export default class NotificationMiddleware {
  static getNotificationList({page_number = 1}) {
    return async (dispatch: Dispatch<DispatchActionType>) => {
      try {
        let user: any = await AsyncStorage.getItem('@User');
        user = JSON.parse(user || '');

        let response = await ApiRequest.Get(
          APIs.GetNotifications(page_number),
          BearerHeaders(user.token),
        );
        dispatch(
          NotificationAction.getNotifications({
            data: response.data.data,
            next_page_url: response.data.next_page_url,
          }),
        );
      } catch (err) {
        console.log('ERROR=>', err);
      }
    };
  }

  static isReadNotifications() {
    return async (dispatch: DispatchProp) => {
      try {
        let formdata = new FormData();
        formdata.append('is_read', 1);

        let user: any = await AsyncStorage.getItem('@User');
        user = JSON.parse(user || '');
        // console.log('user.token', user.token)
        let response = await ApiRequest.Post(
          APIs.isReadNotifciation,
          formdata,
          BearerHeaders(user.token),
        );

        if (response.success) {
        }
      } catch (err) {
        console.log('ERROR=>', err);
      }
    };
  }
}
