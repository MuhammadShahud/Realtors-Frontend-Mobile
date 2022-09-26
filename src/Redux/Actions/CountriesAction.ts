/* eslint-disable prettier/prettier */
import {COUNTRIES, CITIES, STATE} from '../action_types';

const CountriesAction = {
  Countries: (data: any) => {
    return {
      type: COUNTRIES,
      payload: data,
    };
  },
  State: (data: any) => {
    return {
      type: STATE,
      payload: data,
    };
  },
  Cities: (data: any) => {
    return {
      type: CITIES,
      payload: data,
    };
  },
};

export default CountriesAction;
