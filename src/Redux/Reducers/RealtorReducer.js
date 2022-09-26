import { alignContent } from 'styled-system';
import {REALTOR, USERLOGIN} from '../action_types';

const initialState = {
  realtor: [],
};

const RealtorReducer = (state = initialState, action) => {
  switch (action.type) {
    case REALTOR:
      console.log('ACTION 11=>',action.payload )
      state = {...state, realtor: action.payload};
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

export default RealtorReducer;
