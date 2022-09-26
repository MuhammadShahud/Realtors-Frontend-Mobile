/* eslint-disable prettier/prettier */
import {NavigationActions} from 'react-navigation';

let _navigator: {dispatch: (arg0: any) => void};

function navigate(routeName: any, params: any) {
  _navigator.dispatch(
    NavigationActions.navigate({
      routeName,
      params,
    }),
  );
}

function goBack() {
  _navigator.dispatch(NavigationActions.back());
}

export default {
  navigate,
  goBack,
};
