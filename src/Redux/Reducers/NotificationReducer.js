import {GET_NOTIFICATIONS, UPDATE_NOTIFICATION, USERLOGIN} from '../action_types';

const initialState = {
  notificationList: null,
};

const NotificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_NOTIFICATIONS:
      state.notificationList = action.payload;
      return {...state};
      break;
    case UPDATE_NOTIFICATION:
      state = {};
      break;
    case USERLOGIN:
      if (!action.payload) {
        // logout
        state = {...initialState};
      }
      break;
    default:
      break;
  }
  return state;
};

export default NotificationReducer;
