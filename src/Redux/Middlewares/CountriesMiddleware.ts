/* eslint-disable prettier/prettier */
import {ApiRequest, BearerHeaders} from '../../Config/config';
import CountriesAction from '../Actions/CountriesAction';
import APIs from './../../Config/APIs';

export default class CountriesMiddleware {
  static GetCountries() {
    return async (dispatch: any) => {
      try {
        let response = await ApiRequest.Get(APIs.Countries, {});
        if (response.status == 'success') {
          dispatch(CountriesAction.Countries(response.countries));
        }
      } catch (error) {
        console.warn(error);
      }
    };
  }

  static GetCities({id, countryCode, flag, callback}: any) {
    // console.warn('======get cities', countryCode);
    return async (dispatch: any) => {
      try {
        let response = await ApiRequest.Get(
          `${APIs.Cities}/${id}/${countryCode}/${flag}`,
          {},
        );
        if (response.status == 'success') {
          dispatch(CountriesAction.Cities(response.cities));
          callback(response.cities);
        } else {
          callback(false);
        }
      } catch (error) {
        // console.warn('======get cities', error);
      }
    };
  }

  static GetState({token, id, country_code, flag, callback}: any) {
    return async (dispatch: any) => {
      try {
        let BearerHeader = BearerHeaders(token);
        let response = await ApiRequest.Get(
          APIs.State(id, country_code, flag),
          BearerHeader,
        );

        if (response.status == 'success') {
          dispatch(CountriesAction.State(response.states));
          callback(response.states);
        } else {
          callback(false);
        }
      } catch (error) {
        callback(false);
        console.warn(error);
      }
    };
  }
}
