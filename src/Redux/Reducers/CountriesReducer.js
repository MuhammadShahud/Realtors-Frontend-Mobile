import {COUNTRIES, CITIES, STATE , USERLOGIN} from '../action_types';

const initialState = {
  countries: [],
  states: [],
  cities: [],
};

const CountriesReducer = (state = initialState, action) => {
  switch (action.type) {
    case COUNTRIES:
      state = {...state, countries: action.payload};
      break;
    case STATE:
      state = {...state, states: action.payload};
      break;
    case CITIES:
      state = {...state, cities: action.payload};
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

export default CountriesReducer;
