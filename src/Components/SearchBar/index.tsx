import React, { Component } from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  FlatList,
  BackHandler,
  TextInput,
  Modal,
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import { COLORS, SIZES } from '../../Constants';
import styles from './style';
import { connect } from 'react-redux';
import CountriesMiddleware from '../../Redux/Middlewares/CountriesMiddleware';
// import Modal from 'react-native-modal';

interface SearchBarParops {
  title: string;
  right: any;
  left?: any;
  navigation: any;
  onCountrySelect: any;
  onStateSelect: any;
  screen: string | undefined;
}

export class index extends Component<SearchBarParops> {
  state = {
    countryScreen: this.props.screen ? this.props.screen : 'country',
    country: '',
    countryId: '',
    country_state: '',
    stateId: '',
    city: '',
    cityId: '',
    countryModal: false,
    countryCode: '',
    searchText: '',
  };

  OnClickBack = () => {
    const { countries, onCountrySelect, states, onStateSelect } = this.props;

    if (this.state.countryScreen == 'city') {
      this.setState({ countryScreen: 'state' });
      const country = countries.find(x => x.id === this.state.countryId);
      onCountrySelect(country);
      return true;
    } else if (this.state.countryScreen == 'state') {
      this.setState({ countryScreen: 'country' });
      return true;
    } else if (this.state.countryScreen == 'country') {
      return false;
    }
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    let stateObj = {};
    if (nextProps.stateName !== prevState.stateName) {
      stateObj.country_state = nextProps.stateName;
    }
    if (nextProps.screen !== prevState.screen) {
      stateObj.countryScreen = nextProps.screen;
    }
    console.log('stateObj', stateObj)
    return { ...stateObj };
  }

  componentDidMount() {
    this.GetCountries();
    BackHandler.addEventListener('hardwareBackPress', this.OnClickBack);
    this.props.navigation.addListener('focus', () => {
      let {
        GetState,
        GetCities,
        user: { token },
      } = this.props;
      console.log(this.state);
      const { countryId, countryCode, stateId } = this.state;
      console.log('countryId', countryId);
      if (countryId) {
        GetState({
          token,
          id: countryId,
          country_code: countryCode,
          flag: false,
          callback: data => {
            console.log(data);
          },
        });
      }
      console.log('State ID', stateId);
      if (stateId) {
        GetCities({
          id: stateId,
          countryCode,
          flag: false,
          callback: cities => {
            console.log('cities ID', cities.length);
            if (cities.length === 0) {
              let { country, countryId, country_state, stateId, city, cityId } =
                this.state;
              this.setState({ countryScreen: 'state', stateId: '' }, () => {
                this.props.navigation.navigate('Realtors', {
                  country,
                  countryId,
                  country_state,
                  stateId,
                  city: '',
                  cityId: null,
                });
              });
            }
          },
        });
      }
    });
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.OnClickBack);
    this.props.navigation.removeListener('focus', () => { });
  }

  GetCountries = () => {
    let {
      GetCountries,
      user: { token },
    } = this.props;
    GetCountries({ token });
  };

  SelectCountry = (
    val: String,
    id: Number,
    country_code: String,
    country: any,
  ) => {
    let {
      GetState,
      user: { token },
    } = this.props;
    this.props.onCountrySelect(country);
    this.setState(
      {
        country: val,
        countryId: id,
        countryScreen: 'state',
        countryCode: country_code,
        countryModal: false,
        searchText: '',
      },
      () => {
        GetState({
          token,
          id,
          country_code,
          flag: false,
          callback: data => {
            // console.warn(data);
          },
        });
      },
    );
  };

  renderCountries = ({ item }: any) => {
    return (
      <TouchableOpacity
        onPress={() => this.SelectCountry(item.name, item.id, item.iso3, item)}
        style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
        <Text style={{ fontSize: 16 }}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  SelectState = (val: String, id: Number, country: any, state: any) => {
    let { countryCode } = this.state;
    let { GetCities, navigation }: any = this.props;
    this.props.onStateSelect(state);
    this.setState(
      {
        country_state: val,
        stateId: id,
        countryModal: false,
        countryScreen: 'city',
        searchText: '',
      },
      () => {
        GetCities({
          id,
          countryCode,
          flag: false,
          callback: cities => {
            if (cities.length === 0) {
              let { country, countryId, country_state, stateId, city, cityId } =
                this.state;
              this.setState({ countryScreen: 'state', stateId: '' });
              navigation.navigate('Realtors', {
                country,
                countryId,
                country_state,
                stateId,
                city: '',
                cityId: null,
              });
            }
          },
        });
      },
    );
  };

  renderState = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => this.SelectState(item.name, item.id, item, item)}
        style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
        <Text style={{ fontSize: 16 }}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  SelectCity = (val: String, id: Number) => {
    let { navigation } = this.props;
    this.setState({ city: val, cityId: id, countryModal: false }, () => {
      let { country, countryId, country_state, stateId, city, cityId } =
        this.state;
      navigation.navigate('Realtors', {
        country,
        countryId,
        country_state,
        stateId,
        city,
        cityId,
      });
    });
  };

  renderCities = ({ item }: any) => {
    return (
      <TouchableOpacity
        onPress={() => this.SelectCity(item.name, item.id)}
        style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
        <Text style={{ fontSize: 16 }}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  render() {
    let { title, right, left, countries, states, cities } = this.props;
    const { searchText, countryScreen } = this.state;
    console.log('this.state.country_state', this.state.country_state);

    let countries_list = countries;
    let states_list = states;
    let cities_list = cities;

    if (searchText) {
      // For Country Search
      if (countryScreen === 'country') {
        countries_list = countries.filter((x: any) =>
          x.name.toLocaleLowerCase().indexOf(searchText.toLocaleLowerCase()) !==
            -1 ||
            x.iso2.toLocaleLowerCase().indexOf(searchText.toLocaleLowerCase()) !==
            -1 ||
            x.iso3.toLocaleLowerCase().indexOf(searchText.toLocaleLowerCase()) !==
            -1
            ? true
            : false,
        );
      } else {
        countries_list = countries;
      }

      // For States search
      if (countryScreen === 'state' && searchText) {
        states_list = states.filter((x: any) =>
          x.name.toLocaleLowerCase().indexOf(searchText.toLocaleLowerCase()) !==
            -1
            ? true
            : false,
        );
      } else {
        states_list = states;
      }

      // For Cities search
      if (countryScreen !== 'state' && countryScreen !== 'country') {
        cities_list = cities.filter((x: any) =>
          x.name.toLocaleLowerCase().indexOf(searchText.toLocaleLowerCase()) !==
            -1
            ? true
            : false,
        );
      } else {
        cities_list = cities;
      }
    }
    return (
      <View style={styles.container}>
        <View style={styles.right}>{right}</View>

        <View style={{ flex: 1, justifyContent: 'center' }}>
          <TouchableOpacity
            onPress={() => this.setState({ countryModal: true })}
            activeOpacity={0.3}>
            <Text style={{ fontSize: 16, color: COLORS.darkGrey }}>
              {this.state.countryScreen == 'country'
                ? ' Select Country'
                : this.state.countryScreen == 'state'
                  ? 'Select State/Province'
                  : 'Select City'}
            </Text>
          </TouchableOpacity>
        </View>
        {left ? <View style={styles.right}>{left}</View> : null}
        <Modal
          // isVisible={this.state.countryModal}
          // animationIn="slideInUp"
          // animationOut="slideOutDown"
          // backdropOpacity={0.8}
          // backdropColor={COLORS.black}
          // onBackdropPress={() => this.setState({countryModal: false})}
          // style={{margin: 0}}
          // deviceWidth={SIZES.width}
          visible={this.state.countryModal}
          animationType="slide"
          transparent>
          <View
            style={{
              flex: 1,
              justifyContent: 'flex-end',
              backgroundColor: 'rgba(0, 0, 0, 0.2)',
            }}>
            <View
              style={{
                height: '90%',
                backgroundColor: COLORS.white,
                borderTopLeftRadius: 15,
                borderTopRightRadius: 15,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  borderBottomWidth: 1,
                  borderBottomColor: COLORS.lightGrey,
                }}>
                <View style={{ flex: 1, justifyContent: 'center' }}>
                  <Text style={{ textAlign: 'center', fontSize: 18 }}>
                    {this.state.countryScreen == 'country'
                      ? 'Countries'
                      : this.state.countryScreen == 'state'
                        ? 'States/Province'
                        : 'Cities'}
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={() => this.setState({ countryModal: false })}
                  style={{ paddingVertical: 8, paddingHorizontal: 5 }}>
                  <Entypo name="cross" size={23} />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  height: 50,
                  alignItems: 'center',
                  flexDirection: 'row',
                  borderBottomWidth: 1,
                  marginHorizontal: 10,
                  borderColor: COLORS.darkGrey,
                  marginTop: 5,
                }}>
                <View>{right}</View>
                <TextInput
                  placeholder={`Search`}
                  style={{ flex: 1, fontSize: 16, color: COLORS.darkGrey }}
                  onChangeText={text => this.setState({ searchText: text })}
                />
              </View>

              {this.state.countryScreen == 'country' ? (
                <FlatList
                  data={countries_list}
                  renderItem={this.renderCountries}
                />
              ) : this.state.countryScreen == 'state' ? (
                <FlatList
                  data={states_list}
                  renderItem={this.renderState}
                  ListEmptyComponent={() => (
                    <View style={{ height: 85, justifyContent: 'center' }}>
                      {!states_list ? (
                        <Text
                          style={{
                            fontSize: 18,
                            textAlign: 'center',
                            color: COLORS.darkGrey,
                          }}>
                          No State/Province Found
                        </Text>
                      ) : null}
                    </View>
                  )}
                />
              ) : (
                <FlatList
                  data={cities_list}
                  renderItem={this.renderCities}
                  ListEmptyComponent={() => (
                    <View style={{ height: 85, justifyContent: 'center' }}>
                      {!cities_list.length ? (
                        <Text
                          style={{
                            fontSize: 18,
                            textAlign: 'center',
                            color: COLORS.darkGrey,
                          }}>
                          No City Found
                        </Text>
                      ) : null}
                    </View>
                  )}
                />
              )}
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const mapStateToProps = (state: any) => ({
  user: state.AuthReducer.user,
  countries: state.CountriesReducer.countries,
  states: state.CountriesReducer.states,
  cities: state.CountriesReducer.cities,
});

const mapDispatchToProps = (dispatch: (arg0: any) => any) => {
  return {
    GetCountries: (payload: any) =>
      dispatch(CountriesMiddleware.GetCountries(payload)),
    GetCities: (payload: any) =>
      dispatch(CountriesMiddleware.GetCities(payload)),
    GetState: (payload: any) => dispatch(CountriesMiddleware.GetState(payload)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(index);
