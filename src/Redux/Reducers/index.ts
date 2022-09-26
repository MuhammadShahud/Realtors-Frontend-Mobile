/* eslint-disable prettier/prettier */
import {combineReducers} from 'redux';
import AuthReducer from './AuthReducer';
import CountriesReducer from './CountriesReducer';
import RealtorReducer from './RealtorReducer';
import LoaderReducer from './LoaderReducer';
import NotificationReducer from './NotificationReducer';
import ChatReducer from './ChatReducer';

export default combineReducers({
  AuthReducer,
  CountriesReducer,
  RealtorReducer,
  LoaderReducer,
  NotificationReducer,
  ChatReducer,
});
