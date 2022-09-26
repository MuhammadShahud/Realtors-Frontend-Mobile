/* eslint-disable prettier/prettier */
import {GET_CHAT_INBOX, LOGOUT} from '../action_types';

const initialState = {
  chatInbox: null,
};

const ChatReducer = (state = initialState, action) => {
  console.log(action.type, 'action.type');
  switch (action.type) {
    case GET_CHAT_INBOX:
      state = {...state, chatInbox: action.payload};
      break;
    case LOGOUT:
      state = {...state, chatInbox: null};
      break;
    default:
      break;
  }
  return state;
};

export default ChatReducer;
