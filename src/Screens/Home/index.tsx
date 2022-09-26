/* eslint-disable prettier/prettier */
import React, { Component } from 'react';
import { Text, View, Dimensions, StyleSheet, BackHandler , SafeAreaView } from 'react-native';
import { Header, SearchBar, Image } from '../../Components';
import Feather from 'react-native-vector-icons/Feather';
import { COLORS } from '../../Constants';
import ReactNativeZoomableView from '@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView';
import Apis from '../../Config/APIs';
import { connect } from 'react-redux';
import AuthMiddleware from '../../Redux/Middlewares/AuthMiddleware';
import { WebView } from 'react-native-webview';
import MapView from './MapView.js';
import Geocoder from 'react-native-geocoding';
import CountriesMiddleware from '../../Redux/Middlewares/CountriesMiddleware';

interface HomeProps {
  user: any;
  countries: any;
  GetUserData: any;
  navigation: any;
  states: any;
  GetCities: any;
}
class index extends Component<HomeProps> {
  state = {
    countryIso2: undefined, // Country
    countryIso3: undefined,
    stateIso2: undefined, // State
    bottomHeader: '',
    stateName: '',
    latlng: null,
    screen: undefined,
  };

  componentDidMount() {
    let {
      GetUserData,
      user: {
        token,
        user: { id },
      },
    } = this.props;

    GetUserData({ token, userId: id });
    BackHandler.addEventListener('hardwareBackPress', this.OnClickBack);
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.OnClickBack);
  }
  OnClickBack = () => {
    this.setState({ screen: undefined }, () => {
      const { latlng } = this.state;
      this.webview?.injectJavaScript(`
      mymap.setView([${latlng.lat}, ${latlng.lng}], 3);
      true;
      `);
    });
    return;
  };

  onChangeCountry = (country: any) => {
    this.setState({
      countryIso2: country.iso2,
      stateIso2: undefined,
      bottomHeader: country.name,
      stateName: '',
      countryIso3: country.iso3,
      latlng: { lat: country.latitude, lng: country.longitude },
    });
  };
  onStateCountry = (state: any) => {
    this.webview.injectJavaScript(`
    mymap.setView([${state.latitude}, ${state.longitude}], 6);
    true;
    `);
    this.setState({ stateIso2: state.iso2, stateName: state.name });
  };

  onPressState = (latlngString: string) => {
    Geocoder.init('AIzaSyBBVMEPDktEjcindc7_NjCpFWsSWVspyKI'); // use a valid API key
    const latlng = JSON.parse(latlngString);
    Geocoder.from(latlng.lat, latlng.lng)
      .then(json => {
        json.results.find(x => {
          const isFound = x.types.indexOf('administrative_area_level_1');
          if (isFound === 0) {
            let stateios2 = x['address_components'][0]['short_name'];
            let state = this.props.states.find(x => x.iso2 === stateios2);
            console.log('statestatestate', state);
            this.props.GetCities({
              id: state.id,
              countryCode: state.countryCode,
              flag: false,
              callback: (cities: any) => {
                if (cities.length === 0) {
                  this.props.navigation.navigate('Realtors', {
                    country: state.country_code,
                    countryId: state.country_id,
                    country_state: state.name,
                    stateId: state.id,
                    city: '',
                    cityId: null,
                  });
                  this.setState({ screen: 'state', stateName: state.name });
                } else {
                  this.setState({ screen: 'city', stateName: state.name });
                }
              },
            });
          }
        });
        return;
      })
      .catch(error => console.warn(error));
  };

  render() {
    const {
      countryIso2,
      countryIso3,
      stateIso2,
      bottomHeader,
      stateName,
      latlng,
      screen,
    } = this.state;
    const { width, height } = Dimensions.get('window');
    const injectedJavascript = `(function() {
      window.postMessage = function(data) {
        window.ReactNativeWebView.postMessage(data);
      };
    })()`;
    // console.warn('stateName', this.props.user.token);
    return (
      <SafeAreaView style={{flex:1}}>

      <View style={styles.container}>
        <Header title={'Realtor'} />
        <SearchBar
          screen={this.state.screen}
          stateName={stateName}
          onCountrySelect={this.onChangeCountry}
          onStateSelect={this.onStateCountry}
          title="Search Country"
          right={<Feather name="search" size={20} color={COLORS.darkGrey} />}
          navigation={this.props.navigation}
        />
        {latlng ? (
          <WebView
            ref={ref => (this.webview = ref)}
            javaScriptEnabled={true}
            injectedJavaScript={injectedJavascript}
            automaticallyAdjustContentInsets={true}
            onMessage={({ nativeEvent }) => this.onPressState(nativeEvent.data)}
            style={{ flex: 1 }}
            source={{ html: MapView(latlng, countryIso3) }}
          />
        ) : null}
        <Text style={styles.bottomHeader}>
          {stateName ? stateName : bottomHeader}
        </Text>
      </View>
      </SafeAreaView>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: COLORS.white,
  },
  noMapFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomHeader: {
    textAlign: 'center',
    color: COLORS.secondary,
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 5,
  },
});

const mapStateToProps = (state: any) => {
  return {
    user: state.AuthReducer?.user,
    countries: state.CountriesReducer?.countries,
    cities: state.CountriesReducer.cities,
    states: state.CountriesReducer.states,
  };
};

const mapDispatchToProps = (dispatch: (arg0: any) => any) => {
  return {
    GetUserData: (payload: any) =>
      dispatch(AuthMiddleware.GetUserData(payload)),
    GetCities: (payload: any) =>
      dispatch(CountriesMiddleware.GetCities(payload)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(index);
