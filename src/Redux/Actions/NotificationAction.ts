import { GET_NOTIFICATIONS , UPDATE_NOTIFICATION} from '../action_types';

const NotificationAction = {
  getNotifications: (data?: any) => {
    return {
      type: GET_NOTIFICATIONS,
      payload: data,
    };
  },
  updateNotification: (data?: any) => {
    return {
      type: UPDATE_NOTIFICATION,
      payload: data,
    };
  }
};

export default NotificationAction;
