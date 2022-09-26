/* eslint-disable prettier/prettier */
import React, { Component } from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Image,
  TextInput,
  Alert,
  Keyboard,
  Modal,
  ActivityIndicator,
  BackHandler,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Header, SearchBar, MultiSelect } from '../../Components';
import { COLORS, FONTS, Images, SIZES } from '../../Constants';
import Feather from 'react-native-vector-icons/Feather';
import styles from './style';
import { connect } from 'react-redux';
import Entypo from 'react-native-vector-icons/Entypo';
import CountriesMiddleware from '../../Redux/Middlewares/CountriesMiddleware';
import ProfileMiddleware from '../../Redux/Middlewares/ProfileMiddlware';
import RealtorAction from '../../Redux/Actions/RelatorAction';
import CountriesAction from '../../Redux/Actions/CountriesAction';
import { Img_url } from '../../Config/APIs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { dummyImage } from '../../Config/config';
import AuthMiddleware from '../../Redux/Middlewares/AuthMiddleware';

interface RealtorsProps {
  navigation: any;
  ClearCity: any;
  RefreshRealtors: any;
  realtors: any;
  countries: any;
  states: any;
  cities: any;
  user: Object;
  GetRealtors: any;
  GetCountries: any;
  route: any;
  languages: any;
  designation: any;
  speciality: any;
  getLanguages: any;
  getDesignation: any;
  getSpeciality: any;
}

class index extends Component<RealtorsProps> {
  constructor(props: any) {
    let { country, countryId, city, cityId, country_state, stateId } =
      props.route.params;
    super(props);
    this.state = {
      country: [],
      state: [],
      city: [],
      filters: [`${country}`, `${country_state}`, `${city}`],
      realtors: [],
      updateCountry: '',
      updateCountryId: countryId,
      updateState: '',
      updateStateId: stateId,
      updateCity: '',
      updateCityId: cityId,

      experience: '',
      speciality: '',
      modal: false,
      countryModal: false,
      modaltype: '',
      text: '',
      refresh: true,
      countryCode: '',
      loading: false,
      selectedLanguagesIds: [],
      selectedSpecialityIds: [],
      selectedDesignationIds: [],
      nextRealtorPageNumber: undefined,
    };
  }

  componentDidMount() {
    this.props.getLanguages();
    this.props.getDesignation();
    this.props.getSpeciality();
    let { country } = this.props?.route?.params;
    this.GetRealtor();
    const countryObj = this.props.countries?.find(
      (x: any) => x.name === country,
    );
    this.setState({ countryCode: countryObj.iso3 });
  }

  componentDidUpdate(prevProps: any, prevState: any) {
    let { text }: any = this.state;
    console.log('prevState.text', prevState.text, '-', text);
    if (prevState.text !== text) {
      this.SearchRealtor();
    }
  }

  GetRealtor = () => {
    let {
      updateCountryId,
      updateStateId,
      updateCityId,
      experience,
      speciality,
      selectedLanguagesIds,
      selectedSpecialityIds,
      selectedDesignationIds,
      nextRealtorPageNumber,
      text,
    }: any = this.state;
    let {
      GetRealtors,
      user: { token, user },
    }: any = this.props;

    GetRealtors({
      token,
      updateCountryId,
      updateStateId,
      updateCityId,
      full_name: text,
      experience,
      selectedLanguagesIds,
      selectedSpecialityIds,
      selectedDesignationIds,
      page: nextRealtorPageNumber ? nextRealtorPageNumber : 1,
      realtors: nextRealtorPageNumber > 1 ? this.props.realtors : [],
      callback: (data: any) => {
        if (data) {
          let next_page_url = data.next_page_url;
          let page: any = '1';
          if (data.next_page_url) {
            page = next_page_url.slice(next_page_url.lastIndexOf('=') + 1);
          } else {
            page = null;
          }
          this.setState({
            refresh: false,
            updateCountry: '',
            updateState: '',
            updateCity: '',
            // experience: '',
            speciality: '',
            nextRealtorPageNumber: page,
          });
        } else {
          this.setState({
            refresh: false,
            updateCountry: '',
            updateState: '',
            updateCity: '',
            // experience: '',
            speciality: '',
            realtors: '',
          });
        }
      },
    });
  };

  SearchRealtor = () => {
    let {
      text,
      updateCountryId,
      updateStateId,
      updateCityId,
      selectedLanguagesIds,
      selectedSpecialityIds,
      selectedDesignationIds,
    }: any = this.state;

    let {
      user: { token },
    }: any = this.props;

    clearTimeout(this.timeOutId);
    this.setState({ loading: true });

    if (text) {
      this.timeOutId = setTimeout(() => {
        this.props.GetRealtors({
          token,
          updateCountryId,
          updateStateId,
          updateCityId,
          full_name: text,
          selectedLanguagesIds,
          selectedSpecialityIds,
          selectedDesignationIds,
          page: 1,
          realtors: [],

          callback: (data: any) => {
            if (data) {
              let next_page_url = data.next_page_url;
              let page: any = '1';
              if (data.next_page_url) {
                page = next_page_url.slice(next_page_url.lastIndexOf('=') + 1);
              } else {
                page = null;
              }
              this.setState({
                nextRealtorPageNumber: page,
              });
            } else {
              this.setState({ refresh: false });
            }

            // this.setState({ nextRealtorPageNumber: null })
            data
              ? this.setState({ loading: false })
              : this.setState({ loading: true });
          },
        });
      }, 1000);
    } else {
      this.timeOutId = setTimeout(() => {
        this.GetRealtor();
        this.setState({ loading: false });
      });
    }
  };

  filterRealtor = () => {
    let {
      filters,
      updateCountry,
      updateState,
      updateCity,
      experience,
      speciality,
    }: any = this.state;
    // console.log('updateCountry || updateState || updateCity', updateCountry, updateState, updateCity)
    let numRegex = /^\d+$/;
    if (experience && !numRegex.test(experience)) {
      Alert.alert('Error', 'Invalid Experience');
      return;
    }

    let aplhaRegex = /^[a-zA-Z]+$/;
    if (speciality && !aplhaRegex.test(speciality)) {
      Alert.alert('Error', 'Only alphabets are allowed.');
      return;
    }

    if (updateCountry) {
      filters.splice(0, 1, updateCountry);
    }
    if (updateState) {
      filters.splice(1, 1, updateState);
    }
    if (updateCity) {
      filters.splice(2, 1, updateCity);
    }

    // if (updateCountry || updateState || updateCity) {
    this.setState(
      {
        filters,
        modal: false,
        refresh: true,
        nextRealtorPageNumber: undefined,
      },
      () => {
        this.GetRealtor();
      },
    );
    // }

    // } else if (updateCountry && !updateState) {
    //   Alert.alert('Please select State and city');
    // } else {
    //   Alert.alert('All fields are required!');
    // }
  };

  renderRealtors = ({ item, index }: any) => {
    return (
      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('Profile', { item })}
        style={styles.realtorsContainer}>
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Image
              source={{ uri: item?.image ? Img_url + item?.image : dummyImage }}
              style={{ width: 55, height: 55, borderRadius: 100 }}
            />
          </View>
          <View style={styles.iconContainer}>
            <Image
              source={require('../../Assets/Group.png')}
              style={{ width: 25, height: 30, resizeMode: 'contain' }}
            />
          </View>
        </View>

        <View style={{ flex: 1, justifyContent: 'center' }}>
          {/* <Text>{`${item.f_name} ${item.l_name}`}</Text> */}
          <Text style={{ paddingVertical: 6 }}>{item.f_name}</Text>
          {/* <Text>5 miles</Text> */}

          <Image
            source={require('../../Assets/userIcon.png')}
            style={{ width: 20, height: 20, tintColor: COLORS.primary }}
          />
        </View>
      </TouchableOpacity>
    );
  };

  SelectCountry = (val: String, id: Number, country_code: String) => {
    let { filters }: any = this.state;
    let {
      GetState,
      user: { token },
    }: any = this.props;
    let copyFilters = filters;
    if (val != copyFilters[0]) {
      copyFilters[1] = '';
      copyFilters[2] = '';
      this.setState({
        updateStateId: '',
        updateCityId: '',
      });
    }
    copyFilters[0] = val;
    // copyFilters[1] = '';
    // copyFilters[2] = '';
    this.props.ClearCity([]);
    this.setState(
      {
        countryModal: false,
        updateCountryId: id,
        updateState: '',
        updateCity: '',
        countryCode: country_code,
        updateCountry: val,
        filters: copyFilters,
      },
      () => {
        GetState({ token, id, country_code, flag: false, callback: () => { } });
      },
    );
  };

  renderCountries = ({ item }: any) => {
    return (
      <TouchableOpacity
        onPress={() => this.SelectCountry(item.name, item.id, item.iso3)}
        style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
        <Text style={{ fontSize: 16 }}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  renderExperience = ({ item }: any) => {
    return (
      <TouchableOpacity
        onPress={() => this.setState({ experience: item, countryModal: false })}
        style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
        <Text style={{ fontSize: 16, color: 'black' }}>{item}</Text>
      </TouchableOpacity>
    );
  };

  SelectState = (val: String, id: Number) => {
    let { countryCode, filters }: any = this.state;
    let { GetCities }: any = this.props;
    let copyFilters = filters;
    if (val != copyFilters[1]) {
      copyFilters[2] = '';
      this.setState({
        updateCityId: '',
      });
    }
    copyFilters[1] = val;
    // copyFilters[2] = '';

    this.setState(
      {
        countryModal: false,
        updateState: val,
        updateStateId: id,
        filters: copyFilters,
      },
      () => {
        GetCities({ id, countryCode, flag: false });
      },
    );
  };

  renderState = ({ item }: any) => {
    return (
      <TouchableOpacity
        onPress={() => this.SelectState(item.name, item.id)}
        style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
        <Text style={{ fontSize: 16 }}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  GetCountries = () => {
    let { GetCountries } = this.props;
    GetCountries();
  };

  SelectCity = (val: String, id: Number) => {
    let { filters }: any = this.state;
    let copyFilters = filters;
    copyFilters[2] = val;
    this.setState({
      updateCity: val,
      updateCityId: id,
      countryModal: false,
      modalType: '',
      filters: copyFilters,
    });
  };

  renderCities = ({ item }: any) => {
    return (
      <TouchableOpacity
        onPress={() => this.SelectCity(item.name, item.id)}
        style={{
          paddingHorizontal: SIZES.padding2 + 4,
          paddingVertical: SIZES.padding2,
        }}>
        <Text style={{ fontSize: SIZES.padding2 + 4 }}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  OpenModal = (visible: boolean) => {
    this.setState({
      modal: visible,
    });
  };

  OnRefresh = () => {
    this.setState({ refresh: true });
    let realtor: any = [];
    this.props.RefreshRealtors(realtor);
    this.GetRealtor();
  };

  onPressLanguagesSave = (selectedLanguagesIds: []) => {
    this.setState({ selectedLanguagesIds });
  };
  onPressDesignationSave = (selectedDesignationIds: []) => {
    this.setState({ selectedDesignationIds });
  };
  onPressSpecialitySave = (selectedSpecialityIds: []) => {
    this.setState({ selectedSpecialityIds });
  };

  render() {
    let {
      loading,
      filters,
      refresh,
      modal,
      countryModal,
      modalType,
      selectedLanguagesIds,
      selectedDesignationIds,
      selectedSpecialityIds,
      experience,
    }: any = this.state;

    const { languages, designation, speciality } = this.props;
    console.log('experience=>', experience)

    const experienceList = Array.from(Array(101).keys()).slice(1).map(x => {
      if (this.state.experience == x) {
        return {
          id: x,
          name: String(x),
          checked: true
        }
      } else {
        return {
          id: x,
          name: String(x),
        }
      }
    })

console.log("this.props.realtors", this.props.realtors)
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <Header title="Realtor" />
          <View style={{ flex: 1 }}>
            <View style={{ paddingHorizontal: SIZES.padding * 2 }}>
              <View
                style={{
                  width: '100%',
                  alignSelf: 'center',
                  flexDirection: 'row',
                  borderWidth: 1,
                  marginVertical: SIZES.padding,
                  borderRadius: SIZES.radius,
                  borderColor: COLORS.darkGrey,
                }}>
                <View
                  style={{
                    justifyContent: 'center',
                    paddingVertical: SIZES.padding2,
                    paddingHorizontal: SIZES.padding,
                  }}>
                  <Feather name="search" size={20} color={COLORS.darkGrey} />
                </View>

                <TextInput
                  onChangeText={text => this.setState({ text })}
                  placeholder="Search Realtor"
                  placeholderTextColor={COLORS.darkGrey}
                  style={{ flex: 1 }}
                />

                <View
                  style={{
                    justifyContent: 'center',
                    paddingVertical: 13,
                    paddingHorizontal: 10,
                  }}>
                  <Feather name="filter" size={20} color={COLORS.darkGrey} />
                </View>
              </View>
            </View>
            <View style={styles.filterBody}>
              <View style={styles.filterContainer}>
                {filters[0] ? (
                  <View style={styles.names}>
                    <Text
                      numberOfLines={1}
                      style={{
                        color: COLORS.secondary,
                        fontWeight: 'bold',
                        fontSize: 12,
                      }}>
                      {filters[0]}
                    </Text>
                  </View>
                ) : null}
                {filters[1] ? (
                  <View style={styles.names}>
                    <Text
                      numberOfLines={1}
                      style={{
                        color: COLORS.secondary,
                        fontWeight: 'bold',
                        fontSize: 12,
                      }}>
                      {filters[1]}
                    </Text>
                  </View>
                ) : null}
                {filters[2] ? (
                  <View style={styles.names}>
                    <Text
                      numberOfLines={1}
                      style={{
                        color: COLORS.secondary,
                        fontWeight: 'bold',
                        fontSize: 12,
                      }}>
                      {filters[2]}
                    </Text>
                  </View>
                ) : null}
              </View>
              <TouchableOpacity
                style={styles.button}
                onPress={() => this.OpenModal(true)}>
                <Text style={{ color: COLORS.white, fontSize: 12 }}>
                  Apply Filter
                </Text>
              </TouchableOpacity>
            </View>

            {loading ? (
              <View
                style={{
                  marginVertical: SIZES.padding,
                  alignItems: 'center',
                }}>
                <ActivityIndicator size="large" color={COLORS.primary} />
              </View>
            ) : (
              <FlatList
                columnWrapperStyle={{ justifyContent: 'space-between' }}
                data={this.props.realtors}
                style={styles.flatList}
                renderItem={this.renderRealtors}
                numColumns={2}
                keyExtractor={(item, index) => index.toString()}
                refreshing={refresh}
                onRefresh={this.OnRefresh}
                onEndReachedThreshold={0.1}
                onEndReached={info => {
                  if (this.state.nextRealtorPageNumber !== null) {
                    this.GetRealtor();
                  }
                }}
                ListEmptyComponent={() => (
                  <View style={{ paddingVertical: SIZES.padding * 3 }}>
                    {this.props.realtors.length || !refresh ? (
                      <Text
                        style={{
                          textAlign: 'center',
                          fontSize: 16,
                          color: COLORS.darkGrey,
                        }}>
                        No Realtors Found
                      </Text>
                    ) : null}
                  </View>
                )}
              />
            )}
          </View>

          {/* Modal */}
          <Modal visible={modal} transparent>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                backgroundColor: 'rgba(0,0,0,0.4)',
                paddingHorizontal: SIZES.padding * 2,
              }}>
              <View
                style={{
                  backgroundColor: COLORS.primary,
                  borderRadius: SIZES.radius,
                  paddingHorizontal: SIZES.padding * 2,
                  paddingVertical: SIZES.padding * 2,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                  }}>
                  <Text style={styles.modalTitle}>Filters</Text>
                  <View
                    style={{
                      position: 'absolute',
                      right: -10,
                      top: -10,
                    }}>
                    <TouchableOpacity onPress={() => this.OpenModal(false)}>
                      <Entypo name="cross" size={20} color={COLORS.white} />
                    </TouchableOpacity>
                  </View>
                </View>
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  style={{
                    backgroundColor: COLORS.primary,
                    borderRadius: SIZES.radius,
                    maxHeight: 420,
                  }}>
                  <Text style={styles.inputTitle}>Location</Text>

                  <View style={styles.inputContainer}>
                    <TouchableOpacity
                      style={styles.input}
                      onPress={() => {
                        this.setState({
                          modalType: 'country',
                          countryModal: true,
                        }),
                          Keyboard.dismiss();
                      }}>
                      <Text
                        style={{
                          color: COLORS.black,
                          textAlign: 'center',
                          fontSize: 12,
                        }}>
                        {filters[0]}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.input, { marginHorizontal: 5 }]}
                      onPress={() => {
                        this.setState({ modalType: 'state', countryModal: true });
                        Keyboard.dismiss();
                      }}>
                      <Text
                        style={{
                          color: filters[1] ? COLORS.black : COLORS.darkGrey,
                          textAlign: 'center',
                          fontSize: 12,
                        }}>
                        {/* {this.state.updateState ? this.state.updateState : 'State'} */}
                        {filters[1] || 'State/Province'}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.input}
                      onPress={() => {
                        this.setState({ modalType: 'city', countryModal: true }),
                          Keyboard.dismiss();
                      }}>
                      <Text
                        style={{
                          color: filters[2] ? COLORS.black : COLORS.darkGrey,
                          textAlign: 'center',
                          fontSize: 12,
                        }}>
                        {/* {this.state.updateCity ? this.state.updateCity : 'City'} */}
                        {filters[2] || 'City'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <MultiSelect
                    popupTitle={'Select Years in the industry'}
                    styling={[styles.input, { height: undefined }]}
                    isSelectSingle={true}
                    title={'Select Years in the industry'}
                    titleStyle={{
                      color: COLORS.darkGrey,
                      ...FONTS.body4,
                      paddingHorizontal: SIZES.padding - 6,
                      paddingVertical: SIZES.padding - 3,
                    }}
                    searchPlaceHolderText={'Search'}
                    data={experienceList}
                    onPressSave={(data) => { this.setState({ experience: data[0] }); }}

                  />

                  {/* <Text style={styles.inputTitle}>Experience</Text>
                  <TouchableOpacity
                    onPress={() =>
                      this.setState({
                        modalType: 'experience',
                        countryModal: true,
                      })
                    }
                    style={{
                      paddingVertical: 16,
                      backgroundColor: COLORS.white,
                      borderRadius: SIZES.radius,
                      marginTop: SIZES.padding,
                    }}>
                    <Text
                      style={{
                        fontSize: 12,
                        paddingHorizontal: SIZES.padding2,
                        color: COLORS.darkGrey,
                      }}>
                      {this.state.experience
                        ? this.state.experience
                        : 'Years in the experience'}
                    </Text>
                     <TextInput
                      placeholder="Years of experience"
                      keyboardType={'numeric'}
                      placeholderTextColor={COLORS.darkGrey}
                      style={styles.input}
                      onChangeText={text => {
                        this.setState({experience: text});
                      }}
                      onFocus={() => this.setState({countryModal: false})}
                    /> 
                  </TouchableOpacity> */}

                  <Text style={styles.inputTitle}>Languages</Text>
                  <MultiSelect
                    styling={[styles.input, { height: undefined }]}
                    // isSelectSingle={true}
                    popupTitle={'Select Languages'}
                    title={'Select Languages'}
                    titleStyle={{
                      color: COLORS.darkGrey,
                      fontSize: SIZES.padding2,
                    }}
                    searchPlaceHolderText={'Search Languages'}
                    data={languages}
                    onPressSave={this.onPressLanguagesSave}
                  />
                  <Text style={styles.inputTitle}>Designation</Text>
                  <MultiSelect
                    styling={[styles.input, { height: undefined }]}
                    // isSelectSingle={true}
                    popupTitle={'Select Designation'}
                    title={'Select Designation'}
                    titleStyle={{
                      color: COLORS.darkGrey,
                      fontSize: SIZES.padding2,
                    }}
                    searchPlaceHolderText={'Search Designation'}
                    data={designation}
                    onPressSave={this.onPressDesignationSave}
                  />
                  <Text style={styles.inputTitle}>Speciality</Text>
                  <MultiSelect
                    styling={[styles.input, { height: undefined }]}

                    // isSelectSingle={true}
                    popupTitle={'Select Speciality'}
                    title={'Select Speciality'}
                    titleStyle={{
                      color: COLORS.darkGrey,
                      fontSize: SIZES.padding2,
                    }}
                    searchPlaceHolderText={'Search Speciality'}
                    data={speciality}
                    onPressSave={this.onPressSpecialitySave}
                  />

                  {/* <View style={styles.inputContainer}>
                <TextInput
                  placeholder="Skills"
                  placeholderTextColor={COLORS.darkGrey}
                  style={[
                    styles.input,
                    {width: '100%', height: SIZES.padding * 5},
                  ]}
                  onChangeText={text => this.setState({speciality: text})}
                  onFocus={() => this.setState({countryModal: false})}
                />
              </View> */}
                </ScrollView>
                <TouchableOpacity
                  style={styles.btn}
                  onPress={() => this.filterRealtor()}>
                  <Text style={styles.btnText}>Apply Filter</Text>
                </TouchableOpacity>
              </View>
            </View>

            {countryModal ? (
              <View
                style={{
                  flex: 0.6,
                  width: '100%',
                  backgroundColor: COLORS.white,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    borderBottomWidth: 1,
                    borderBottomColor: COLORS.lightGrey,
                  }}>
                  <View style={{ flex: 1, justifyContent: 'center' }}>
                    <Text style={{ textAlign: 'center', fontSize: 18 }}>
                      {modalType == 'country'
                        ? 'Countries'
                        : modalType == 'state'
                          ? 'States/Province'
                          : modalType == 'experience'
                            ? 'Years in the industry'
                            : 'Cities'}
                    </Text>
                  </View>

                  <TouchableOpacity
                    onPress={() => this.setState({ countryModal: false })}
                    style={{ paddingVertical: 8, paddingHorizontal: 5 }}>
                    <Entypo name="cross" size={23} />
                  </TouchableOpacity>
                </View>

                {modalType == 'country' ? (
                  <FlatList
                    data={this.props.countries}
                    renderItem={this.renderCountries}
                  />
                ) : modalType == 'state' ? (
                  <FlatList
                    data={this.props.states}
                    renderItem={this.renderState}
                    ListEmptyComponent={() => (
                      <View style={{ height: 85, justifyContent: 'center' }}>
                        {!this.props.states.length ? (
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
                ) : modalType == 'experience' ? (
                  <FlatList
                    data={this.state.experienceArray}
                    renderItem={this.renderExperience}
                  />
                ) : (
                  <FlatList
                    data={this.props.cities}
                    renderItem={this.renderCities}
                    ListEmptyComponent={() => (
                      <View style={{ height: 85, justifyContent: 'center' }}>
                        {!this.props.cities.length ? (
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
            ) : null}
          </Modal>
        </View>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state: any) => ({
  user: state.AuthReducer.user,
  countries: state.CountriesReducer.countries,
  states: state.CountriesReducer.states,
  cities: state.CountriesReducer.cities,
  realtors: state.RealtorReducer.realtor,
  languages: state.AuthReducer.languages,
  speciality: state.AuthReducer.speciality,
  designation: state.AuthReducer.designation,
});

const mapDispatchToProps = (dispatch: (arg0: any) => any) => {
  return {
    getLanguages: () => dispatch(AuthMiddleware.getLanguages()),
    getSpeciality: () => dispatch(AuthMiddleware.getSpeciality()),
    getDesignation: () => dispatch(AuthMiddleware.getDesignation()),
    GetCountries: () => dispatch(CountriesMiddleware.GetCountries()),
    GetState: (payload: any) => dispatch(CountriesMiddleware.GetState(payload)),
    GetCities: (payload: any) =>
      dispatch(CountriesMiddleware.GetCities(payload)),
    GetRealtors: (payload: any) =>
      dispatch(ProfileMiddleware.GetRealtors(payload)),
    RefreshRealtors: (payload: any) => dispatch(RealtorAction.Realtor(payload)),
    ClearCountries: (payload: any) =>
      dispatch(CountriesAction.Countries(payload)),
    ClearState: (payload: any) => dispatch(CountriesAction.State(payload)),
    ClearCity: (payload: any) => dispatch(CountriesAction.Cities(payload)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(index);
