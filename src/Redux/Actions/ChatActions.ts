/* eslint-disable prettier/prettier */
import {GET_CHAT_INBOX} from '../action_types';

const ChatAction = {
  chatInbox: (data: any) => {
    return {
      type: GET_CHAT_INBOX,
      payload: data,
    };
  },
};

export default ChatAction;
