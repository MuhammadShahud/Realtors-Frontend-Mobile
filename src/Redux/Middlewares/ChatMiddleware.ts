/* eslint-disable prettier/prettier */
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ApiRequest, BearerHeaders} from '../../Config/config';
import ChatAction from '../Actions/ChatActions';
import CountriesAction from '../Actions/CountriesAction';
import APIs from './../../Config/APIs';

export default class ChatMiddleware {
  static getChatInbox({callBack}) {
    return async (dispatch: any) => {
      try {
        console.log('getChatInbox CALLED');
        let user: any = await AsyncStorage.getItem('@User');
        user = JSON.parse(user || '');

        console.log('user', user);
        let response = await ApiRequest.Get(
          APIs.chatInbox,
          BearerHeaders(user.token),
        );
        console.log('response 21', response);
        if (response?.success) {
          callBack(true);
          console.log('response', response);
          dispatch(ChatAction.chatInbox(response.data));
        }
      } catch (error) {

        
        console.warn(error);
      }
    };
  }
  static getRecentMessages({chatlist_id, page = 1, callBack}) {
    console.log('chatlist_id, page = 1, callBack', chatlist_id, page = 1, callBack)
    return async (dispatch: any) => {
      try {
        let user: any = await AsyncStorage.getItem('@User');
        user = JSON.parse(user || '');

        console.log('user', user);
        let response = await ApiRequest.Get(
          APIs.viewChatList(chatlist_id, page),
          BearerHeaders(user.token),
        );
        console.log('response getRecentMessages', response);
        if (response?.success) {
          callBack(response.data);
          console.log('response', response);
          return;
        } else {
          callBack(false);
        }
      } catch (error) {
        callBack(false);
        console.warn(error);
      }
    };
  }
  static sendMessage({to_user, message, callBack}) {
    return async (dispatch: any) => {
      try {
        let user: any = await AsyncStorage.getItem('@User');
        user = JSON.parse(user || '');
        console.log('to_userto_userto_user', to_user);
        const formData = new FormData();
        formData.append('type', 'text');
        formData.append('user_id', to_user);
        formData.append('message', message);

        let response = await ApiRequest.Post(
          APIs.messageSend,
          formData,
          BearerHeaders(user.token),
        );
        console.log('response', response);
        if (response?.success) {
          callBack(response.data);
          return;
        }
        callBack(false);
      } catch (error) {
        console.warn(error);
      }
    };
  }
  static chatlistCheck({to_user_id, callBack}) {
    return async (dispatch: any) => {
      try {
        let user: any = await AsyncStorage.getItem('@User');
        user = JSON.parse(user || '');

        const formData = new FormData();
        formData.append('to_user_id', to_user_id);
        let response = await ApiRequest.Post(
          APIs.chatlistCheck,
          formData,
          BearerHeaders(user.token),
        );
        console.log('response --> 100', response);
        if (response?.status == '200') {
          callBack(response.data);
          return;
        } else {
          callBack(false);
        }
      } catch (error) {
        console.warn(error);
      }
    };
  }
}
