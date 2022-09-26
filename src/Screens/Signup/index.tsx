/* eslint-disable prettier/prettier */
import React, { PureComponent, Component } from 'react';
import {
  View,
  SafeAreaView,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  FlatList,
  Alert,
  Platform,
  // Modal,
} from 'react-native';
import { COLORS, FLEXBOX, FONTS, Images, SIZES } from '../../Constants';
import styles from './style';
import FaIcons from 'react-native-vector-icons/FontAwesome';
import MCIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';
import Modal from 'react-native-modal';
import { WebView, MultiSelect } from '../../Components';
import CheckBox from '@react-native-community/checkbox';
import { Toast } from 'native-base';
import AuthMiddleware from '../../Redux/Middlewares/AuthMiddleware';
import Entypo from 'react-native-vector-icons/Entypo';
import CountriesMiddleware from '../../Redux/Middlewares/CountriesMiddleware';
import {
  LoginManager,
  Profile,
  GraphRequest,
  AccessToken,
  GraphRequestManager,
} from 'react-native-fbsdk-next';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
interface SignUpProps {
  navigation: any;
  Signup: any;
  countries: any;
  states: any;
  cities: any;
  GetCountries: any;
  GetCities: any;
  GetState: any;
  SocialLogin: any;
  getAppContent: any;
  languages: any;
  designation: any;
  speciality: any;
  getLanguages: any;
  getDesignation: any;
  getSpeciality: any;
}
export class index extends PureComponent<SignUpProps> {
  state = {
    f_name: '',
    l_name: '',
    email: '',
    password: '',
    confirm_password: '',
    phone_no: '',
    license_no: '',
    country: '',
    country_state: '',
    city: '',
    countryCode: '',
    countryId: null,
    stateId: null,
    cityId: null,
    experience: '',
    modalVisible: false,
    checked: false,
    confirmationModal: false,
    loading: false,
    showPassword: false,
    countryModal: false,
    modalType: '',
    show_confirm_password: false,
    terms_condition: '',
    selectedLanguagesIds: [],
    selectedSpecialityIds: [],
    selectedDesignationIds: [],
  };

  componentDidMount() {
    this.props.getLanguages();
    this.props.getDesignation();
    this.props.getSpeciality();
    this.props.getAppContent({
      callBack: (data: any) => {
        this.setState({ terms_condition: data });
      },
    }),
      this.GetCountries();
  }

  onChangeText = (type: any, value: any) => {
    this.setState({
      [type]: value,
    });
  };

  validate = (text: string) => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (reg.test(text) === false) {
      Toast.show({
        title: 'Email is not correct',
      });
      this.setState({ email: text });
      return false;
    } else {
      this.setState({ email: text });
    }
  };

  handlePress = (visible: boolean) => {
    this.setState({
      modalVisible: visible,
    });
  };

  onChecked = (type: String) => {
    if (type == 'accept') {
      this.setState({
        modalVisible: false,
        checked: true,
      });
    }
    // else {
    //   const {checked} = this.state;
    //   if (!checked) {
    //     this.setState({
    //       checked: true,
    //     });
    //   } else if (checked) {
    //     this.setState({
    //       checked: false,
    //     });
    //   }
    // }
  };

  ShowPasssword = () => {
    this.setState({ showPassword: !this.state.showPassword });
  };

  GetCountries = () => {
    let { GetCountries } = this.props;
    GetCountries();
  };

  SelectCountry = (val: String, id: Number, country_code: String) => {
    let { GetState, GetCities, country } = this.props;
    if (val != country) {
      this.setState({
        country_state: '',
        city: '',
      });
    }
    this.setState(
      {
        country: val,
        countryId: id,
        countryCode: country_code,
        countryModal: false,
      },
      () => {
        GetState({
          id,
          country_code,
          flag: false,
          callback: (data: any) => {
            console.warn('==========return callback', data);
            if (data.length) {
            } else {
              // GetCities({id: null, countryId: id, countryCode: country_code, flag: false});
            }
          },
        });
      },
    );
  };

  onPressFacebooklogin = () => {
    LoginManager.logInWithPermissions(['public_profile', 'email']).then(
      result => {
        if (result.isCancelled) {
          console.log('Login cancelled');
        } else {
          Profile.getCurrentProfile().then(currentProfile => {
            AccessToken.getCurrentAccessToken().then(token => {
              new GraphRequestManager()
                .addRequest(
                  new GraphRequest(
                    '/me',
                    {
                      accessToken: token?.accessToken,
                      parameters: {
                        fields: {
                          string: 'email,first_name,middle_name,last_name',
                        },
                      },
                    },
                    (err, res) => {
                      if (err) {
                        Alert.alert('Something went wrong');
                        Toast.show({
                          title: 'Something went wrong',
                          placement: 'bottom-left',
                          status: 'error',
                          duration: 3000,
                        });
                      } else {
                        let profile_obj = {
                          f_name: res?.first_name,
                          l_name: res?.last_name,
                          email: res.email,
                          type: 'facebook',
                        };
                        this.props.SocialLogin(profile_obj);
                      }
                    },
                  ),
                )
                .start();
            });
          });
        }
      },
      function (error) {
        console.log('Login fail with error: ' + error);
      },
    );
  };

  onPressGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      let profile_obj = {
        f_name: userInfo.user.familyName,
        l_name: userInfo.user.givenName,
        email: userInfo.user.email,
        type: 'google',
      };
      this.props.SocialLogin(profile_obj);
    } catch (error) {
      console.log('Message', error.message);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('User Cancelled the Login Flow');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Signing In');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('Play Services Not Available or Outdated');
      } else {
        console.log('Some Other Error Happened');
      }
    }
  };

  SelectState = (val: String, id: Number) => {
    let { GetCities } = this.props;
    let { countryCode, country_state, countryId } = this.state;
    if (val != country_state) {
      this.setState({
        city: '',
      });
    }
    this.setState(
      {
        country_state: val,
        stateId: id,
        countryModal: false,
      },
      () => {
        GetCities({ id, countryId, countryCode, flag: false });
      },
    );
  };

  SelectCity = (val: String, id: Number) => {
    this.setState({ city: val, cityId: id, countryModal: false });
  };

  renderHome = ({ item }: any) => {
    let { modalType } = this.state;
    return (
      <TouchableOpacity
        onPress={
          modalType == 'country'
            ? () => this.SelectCountry(item.name, item.id, item.iso3)
            : modalType == 'state'
              ? () => this.SelectState(item.name, item.id)
              : modalType == 'city'
                ? () => this.SelectCity(item.name, item.id)
                : undefined
        }
        style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
        <Text style={{ fontSize: 16 }}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  Signup = () => {
    let {
      f_name,
      l_name,
      email,
      password,
      phone_no,
      license_no,
      country,
      countryId,
      country_state,
      stateId,
      city,
      cityId,
      experience,
      loading,
      checked,
      confirm_password,
      selectedDesignationIds,
      selectedLanguagesIds,
      selectedSpecialityIds,
    } = this.state;


    if (!f_name) {
      Alert.alert('Alert', 'First name is required');
      return;
    }
    if (!l_name) {
      Alert.alert('Alert', 'Last name is required');
      return;
    }
    if (!email) {
      Alert.alert('Alert', 'email is required');
      return;
    }
    if (!phone_no) {
      Alert.alert('Alert', 'phone number is required');
      return;
    }
    if (!license_no) {
      Alert.alert('Alert', 'License number is required');
      return;
    }
    if (!password) {
      Alert.alert('Alert', 'Password is required');
      return;
    }
    if (!confirm_password) {
      Alert.alert('Alert', 'Confirm Password is required');
      return;
    }

    if (selectedLanguagesIds.length == 0) {
      Alert.alert('Alert', 'Select Language');
      return;
    }

    if (selectedDesignationIds.length == 0) {
      Alert.alert('Alert', 'Select Designation');
      return;
    }

    if (selectedSpecialityIds.length == 0) {
      Alert.alert('Alert', 'Select Speciality');
      return;
    }

    if (!country) {
      Alert.alert('Alert', 'Country name is required');
      return;
    }
    if (!country_state) {
      Alert.alert('Alert', 'State/Province name is required');
      return;
    }

    if (this.props.cities.length != 0 && !city) {
      Alert.alert('Alert', 'City is required');
      return;
    }
    if (!experience) {
      Alert.alert('Alert', 'Experience is required');
      return;
    }
    // if (!expertise) {
    //   Alert.alert('Alert', 'Expertise are required');
    //   return;
    // }

    let letters = /^[a-zA-Z\s]*$/;
    if (f_name && !letters.test(f_name)) {
      Alert.alert('Alert', 'Invalid first name');
      return;
    }
    if (l_name && !letters.test(l_name)) {
      Alert.alert('Alert', 'Invalid last name');
      return;
    }

    if (confirm_password !== password) {
      Alert.alert('Alert', 'Password mismatch');
      return;
    }

    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (email.length) {
      if (!re.test(String(email).toLowerCase())) {
        Alert.alert('Alert', 'Invalid email');
        return;
      }
    }

    let phoneRegix = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;

    if (phone_no && !phoneRegix.test(phone_no)) {
      Alert.alert('Alert', 'Please enter a valid phone number');
      return;
    }
    if (!re.test(String(email).toLowerCase())) {
      Alert.alert('Alert', 'Invalid email');
      return;
    }
    // expertise = expertise.trim();

    if (experience.length) {
      if (!experience) {
        Alert.alert('Alert', 'Experience is required');
        return;
      }
    }
    // if (expertise && !letters.test(expertise)) {
    //   Alert.alert('Alert', 'Invalid Expertise');
    //   return;
    // }
    let numReges = /^\d+$/;
    if (experience && !numReges.test(experience)) {
      Alert.alert('Alert', 'Invalid Experience');
      return;
    }

    if (selectedLanguagesIds.length == 0) {
      Alert.alert('Alert', 'Select Language');
      return;
    }

    if (selectedDesignationIds.length == 0) {
      Alert.alert('Alert', 'Select Designation');
      return;
    }

    if (selectedSpecialityIds.length == 0) {
      Alert.alert('Alert', 'Select Speciality');
      return;
    }

    if (
      f_name &&
      l_name &&
      email &&
      password &&
      phone_no &&
      country &&
      confirm_password &&
      experience &&
      license_no.length > 0
    ) {
      this.props.Signup({
        f_name,
        l_name,
        email,
        password,
        phone_no,
        license_no,
        country,
        countryId,
        country_state,
        stateId,
        city,
        cityId,
        experience,
        checked,
        selectedDesignationIds,
        selectedLanguagesIds,
        selectedSpecialityIds,
        callback: (data: any) => {
          if (data) {
            this.setState({
              f_name: '',
              l_name: '',
              email: '',
              password: '',
              confirm_password: '',
              phone_no: '',
              license_no: '',
              country: '',
              country_state: '',
              city: '',
              countryCode: '',
              countryId: null,
              stateId: null,
              cityId: null,
              experience: '',
              modalVisible: false,
              checked: false,
              confirmationModal: true,
              loading: false,
              showPassword: false,
              countryModal: false,
              modalType: '',
              show_confirm_password: false,
              terms_condition: '',
              selectedLanguagesIds: [],
              selectedSpecialityIds: [],
              selectedDesignationIds: [],
            });

          } else {
            this.setState({
              loading: false,
            });
          }
        },
      });
    }
  };

  componentWillUnmount() {
    this.setState({
      loading: false,
      f_name: '',
      l_name: '',
      email: '',
      password: '',
      phone_no: '',
      license_no: '',
      country: '',
      countryId: '',
      country_state: '',
      stateId: '',
      city: '',
      cityId: '',
      experience: '',
      selectedLanguagesIds: [],
      selectedSpecialityIds: [],
      selectedDesignationIds: [],
    });
  }

  onPressLanguagesSave = (selectedLanguagesIds: []) => {
    this.setState({ selectedLanguagesIds });
  };
  onPressDesignationSave = (selectedDesignationIds: []) => {
    this.setState({ selectedDesignationIds });
  };
  onPressSpecialitySave = (selectedSpecialityIds: []) => {
    this.setState({ selectedSpecialityIds });
  };
  whiteSpaceHandler = (type: any, value: any) => {
    this.setState({
      [type]: value.replace(/\s/g, ''),
    });
  };
  // aplabetCharHandler = (value: any) => {
  //   this.setState({
  //     expertise: value.replace(/[^A-Za-z,. ]*$/gi, ''),
  //   });
  // };
  render() {

    // console.warn(this.props.cities.length);

    let {
      f_name,
      l_name,
      email,
      password,
      license_no,
      experience,
      phone_no,
      country,
      country_state,
      city,
      modalVisible,
      checked,
      confirmationModal,
      showPassword,
      loading,
      modalType,
      countryModal,
      confirm_password,
      show_confirm_password,
      terms_condition,
    } = this.state;
    let { navigate } = this.props.navigation;
    const { languages, designation, speciality } = this.props;


    const { selectedDesignationIds, selectedLanguagesIds, selectedSpecialityIds } = this.state;
    const designationCopy = designation.map(val => {
      let isSelectedDesignation = selectedDesignationIds.indexOf(val.id);
      if (isSelectedDesignation !== -1) {
        return { ...val, checked: true };
      } else {
        return { ...val };
      }
    });

    const languagesCopy = languages.map(val => {
      let isSelectedLanguage = selectedLanguagesIds.indexOf(val.id);
      if (isSelectedLanguage !== -1) {
        return { ...val, checked: true };
      } else {
        return { ...val };
      }
    });

    const specialityCopy = speciality.map(val => {
      let isSelectedSpeciality = selectedSpecialityIds.indexOf(val.id);
      if (isSelectedSpeciality !== -1) {
        return { ...val, checked: true };
      } else {
        return { ...val };
      }
    });
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

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps={'handled'}
          style={{ backgroundColor: COLORS.white }}
        >
          <View style={styles.container}>
            <View>
              <Image
                style={styles.logo}
                source={Images.home_logo}
                resizeMode="contain"
              />
            </View>

            <Text
              style={{
                ...FONTS.h1,
                alignSelf: FLEXBOX.center,
                marginBottom: 20,
              }}>
              Signup
            </Text>

            <View>
              <TextInput
                style={styles.inputStyles}
                placeholder="Firstname"
                placeholderTextColor={COLORS.darkGrey}
                autoCapitalize="none"
                onChangeText={val => this.onChangeText('f_name', val)}
                value={f_name}
              />
              <TextInput
                style={styles.inputStyles}
                placeholder="Lastname"
                placeholderTextColor={COLORS.darkGrey}
                autoCapitalize="none"
                onChangeText={val => this.onChangeText('l_name', val)}
                value={l_name}
              />
              <TextInput
                style={styles.inputStyles}
                placeholder="Email Address"
                placeholderTextColor={COLORS.darkGrey}
                autoCapitalize="none"
                onChangeText={val => {
                  this.onChangeText('email', val);
                  // this.whiteSpaceHandler('email', val);
                }}
                onBlur={_ => this.validate(email)}
                value={email}
              />
              <TouchableOpacity>
                <TextInput
                  style={[
                    styles.inputStyles,
                    { paddingRight: SIZES.padding * 3 + 5 },
                  ]}
                  secureTextEntry={!showPassword}
                  placeholder="New Password"
                  placeholderTextColor={COLORS.darkGrey}
                  autoCapitalize="none"
                  onChangeText={val => {
                    this.onChangeText('password', val);
                    // this.whiteSpaceHandler('password', val);
                  }}
                  value={password}
                />
                <FaIcons
                  name={!showPassword ? 'eye-slash' : 'eye'}
                  size={18}
                  color={COLORS.lightBlack}
                  style={styles.icon}
                  onPress={this.ShowPasssword}
                />
              </TouchableOpacity>
              <TouchableOpacity>
                <TextInput
                  style={[
                    styles.inputStyles,
                    { paddingRight: SIZES.padding * 3 + 5 },
                  ]}
                  secureTextEntry={!show_confirm_password}
                  placeholder="Confirm Password"
                  placeholderTextColor={COLORS.darkGrey}
                  autoCapitalize="none"
                  onChangeText={val => {
                    this.onChangeText('confirm_password', val);
                    // this.whiteSpaceHandler('confirm_password', val);
                  }}
                  value={confirm_password}
                />
                <FaIcons
                  name={!show_confirm_password ? 'eye-slash' : 'eye'}
                  size={18}
                  color={COLORS.lightBlack}
                  style={styles.icon}
                  onPress={() =>
                    this.setState({
                      show_confirm_password: !this.state.show_confirm_password,
                    })
                  }
                />
              </TouchableOpacity>
              <TextInput
                style={styles.inputStyles}
                placeholder="Phone No."
                placeholderTextColor={COLORS.darkGrey}
                autoCapitalize="none"
                onChangeText={val => this.onChangeText('phone_no', val)}
                keyboardType={'numeric'}
                value={phone_no}
              />
              <MultiSelect
                popupTitle={'Select Languages'}
                styling={styles.selectedInput}
                title={'Select Languages'}
                titleStyle={{
                  color: COLORS.darkGrey,
                  ...FONTS.body4,
                  paddingHorizontal: SIZES.padding - 6,
                  paddingVertical: SIZES.padding - 3,
                }}
                searchPlaceHolderText={'Search Languages'}
                data={languagesCopy}
                onPressSave={this.onPressLanguagesSave}
              />
              <MultiSelect
                popupTitle={'Select Designation'}
                styling={styles.selectedInput}
                title={'Select Designation'}
                titleStyle={{
                  color: COLORS.darkGrey,
                  ...FONTS.body4,
                  paddingHorizontal: SIZES.padding - 6,
                  paddingVertical: SIZES.padding - 3,
                }}
                searchPlaceHolderText={'Search Designation'}
                data={designationCopy}
                onPressSave={this.onPressDesignationSave}
              />
              <MultiSelect
                popupTitle={'Select Speciality'}
                styling={styles.selectedInput}
                title={'Select Speciality'}
                titleStyle={{
                  color: COLORS.darkGrey,
                  ...FONTS.body4,
                  paddingHorizontal: SIZES.padding - 6,
                  paddingVertical: SIZES.padding - 3,
                }}
                searchPlaceHolderText={'Search Speciality'}
                data={specialityCopy}
                onPressSave={this.onPressSpecialitySave}
              />
              <TextInput
                style={styles.inputStyles}
                placeholder="License No."
                placeholderTextColor={COLORS.darkGrey}
                autoCapitalize="none"
                onChangeText={val => {
                  this.onChangeText('license_no', val);
                  // this.whiteSpaceHandler('license_no', val);
                }}
                value={license_no}
              />
              <TouchableOpacity
                onPress={() =>
                  this.setState({
                    countryModal: true,
                    modalType: 'country',
                  })
                }
                style={[
                  styles.inputStyles,
                  { paddingVertical: SIZES.padding * 2 - 2 },
                ]}>
                <Text
                  style={{
                    ...FONTS.body4,
                    color: country ? COLORS.black : COLORS.darkGrey,
                  }}>
                  {country ? country : 'Country'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() =>
                  this.setState({ countryModal: true, modalType: 'state' })
                }
                style={[
                  styles.inputStyles,
                  { paddingVertical: SIZES.padding * 2 - 2 },
                ]}>
                <Text
                  style={{
                    ...FONTS.body4,
                    color:
                      country_state && this.props.states.length
                        ? COLORS.black
                        : COLORS.darkGrey,
                  }}>
                  {country_state ? country_state : 'State/Province'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() =>
                  this.setState({ countryModal: true, modalType: 'city' })
                }
                style={[
                  styles.inputStyles,
                  { paddingVertical: SIZES.padding * 2 - 2 },
                ]}>
                <Text
                  style={{
                    ...FONTS.body4,
                    color:
                      city && this.props.cities.length
                        ? COLORS.black
                        : COLORS.darkGrey,
                  }}>
                  {city ? city : 'City'}
                </Text>
              </TouchableOpacity>
              <MultiSelect
                isSelectSingle={true}
                popupTitle={'Years in the industry'}
                styling={styles.selectedStyle}
                title={'Years in the industry'}
                titleStyle={{
                  color: COLORS.darkGrey,
                  ...FONTS.body4,
                  paddingHorizontal: SIZES.padding - 6,
                  paddingVertical: SIZES.padding - 3,

                }}
                searchPlaceHolderText={'Search'}
                data={experienceList}
                onPressSave={(data) => { this.onChangeText('experience', data[0]); }}
              />
              {/* <TextInput
                style={styles.inputStyles}
                placeholder="Experience"
                maxLength={2}
                placeholderTextColor={COLORS.darkGrey}
                autoCapitalize="none"
                onChangeText={val => {
                  this.onChangeText('experience', val);
                  // this.whiteSpaceHandler('experience', val);
                }}
                keyboardType={'numeric'}
                value={experience}
              /> */}
              {/* <TextInput
                style={styles.inputStyles}
                placeholder="Expertise"
                placeholderTextColor={COLORS.darkGrey}
                autoCapitalize="none"
                onChangeText={val => {
                  this.onChangeText('expertise', val);
                  // this.aplabetCharHandler(val);
                }}
                value={expertise}
              /> */}
              <TouchableOpacity
                style={styles.btn}
                disabled={this.state.loading}
                onPress={this.Signup}>
                {this.state.loading ? (
                  <ActivityIndicator size="small" color={COLORS.white} />
                ) : (
                  <Text style={{ color: COLORS.white, ...FONTS.body3 }}>
                    Sign Up
                  </Text>
                )}
              </TouchableOpacity>
            </View>

            <View
              style={{ flexDirection: FLEXBOX.row, alignItems: FLEXBOX.center }}>
              <CheckBox
                style={{ 
                  height :  Platform.OS === 'ios' ? 20 : undefined,
                  width :  Platform.OS === 'ios' ? 20 : undefined,
                  marginRight : 5
                }}
                tintColors={{ true: COLORS.secondary, false: COLORS.darkGrey }}
                disabled={checked ? false : true}
                value={checked}
                onValueChange={() => this.setState({ checked: false })}
              />
              <TouchableOpacity onPress={() => this.handlePress(true)}>
                <View>
                  <Text style={{ color: COLORS.lightBlack, ...FONTS.body5 }}>
                    Terms & conditions
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
            {/* <View
              style={{paddingTop: SIZES.padding, alignItems: FLEXBOX.center}}>
              <Text style={{color: COLORS.lightBlack, ...FONTS.body5}}>
                or Connect With
              </Text>
            </View> */}

            {/* <View style={{paddingVertical: SIZES.padding}}>
              <TouchableOpacity
                style={styles.socialLogin}
                onPress={this.onPressFacebooklogin}>
                <FaIcons name="facebook" size={16} color="#367fc0" />
                <Text
                  style={{paddingLeft: 10, color: '#367fc0', ...FONTS.body5}}>
                  Signup with Facebook
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.socialLogin}
                onPress={this.onPressGoogleSignIn}>
                <FaIcons name="google-plus" size={16} color="#dd4b39" />
                <Text
                  style={{paddingLeft: 10, color: '#dd4b39', ...FONTS.body5}}>
                  Signup with Google
                </Text>
              </TouchableOpacity>
            </View> */}
          </View>
          <View style={styles.signUpClick}>
            <TouchableOpacity
              style={{
                alignItems: FLEXBOX.center,
                flexDirection: FLEXBOX.row,
                justifyContent: FLEXBOX.center,
              }}>
              <Text
                style={{
                  color: COLORS.lightBlack,
                  ...FONTS.body5,
                }}>
                Already have an Account?
              </Text>

              <Text
                onPress={() => navigate('Login')}
                style={{
                  paddingHorizontal: 5,
                  color: COLORS.primary,
                  fontWeight: 'bold',
                  ...FONTS.body4,
                }}>
                Login
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.blueLine}></TouchableOpacity>
          </View>

          <Modal
            isVisible={countryModal}
            animationIn="slideInUp"
            animationOut="slideOutDown"
            backdropOpacity={0.8}
            backdropColor={COLORS.black}
            onBackdropPress={() => this.setState({ countryModal: false })}
            style={{ margin: 0 }}
            deviceWidth={SIZES.width}>
            <View
              style={{
                flex: 1,
                justifyContent: 'flex-end',
              }}>
              <View
                style={{
                  height: '60%',
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
                      {modalType == 'country'
                        ? 'Countries'
                        : modalType == 'state'
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

                <FlatList
                  data={
                    modalType == 'country'
                      ? this.props.countries
                      : modalType == 'state'
                        ? this.props.states
                        : this.props.cities
                  }
                  renderItem={this.renderHome}
                  ListEmptyComponent={() => (
                    <View style={{ height: 85, justifyContent: 'center' }}>
                      <Text style={styles.notFoundName}>
                        {!this.props.countries.length && modalType == 'country'
                          ? 'No Country Found,'
                          : !this.props.states.length && modalType == 'state'
                            ? 'No State/Province Found,'
                            : 'No City Found,'}
                      </Text>
                    </View>
                  )}
                />

                {/* {this.state.modalType == 'country' ? (
                    <FlatList
                      data={this.props.countries}
                      renderItem={this.renderCountries}
                      ListEmptyComponent={() => (
                        <View style={{height: 85, justifyContent: 'center'}}>
                          {!this.props.countries.length ? (
                            <Text
                              style={{
                                fontSize: 18,
                                textAlign: 'center',
                                color: COLORS.darkGrey,
                              }}>
                              No Country Found,
                            </Text>
                          ) : null}
                        </View>
                      )}
                    />
                  ) : this.state.modalType == 'state' ? (
                    <FlatList
                      data={this.props.states}
                      renderItem={this.renderState}
                      ListEmptyComponent={() => (
                        <View style={{height: 85, justifyContent: 'center'}}>
                          {this.props.states.length ? (
                            <Text
                              style={
                                fontSize: 18,
                                textAlign: 'center',
                                color: COLORS.darkGrey,
                              }}>
                              No State/Province Found,
                            </Text>
                          ) : null}
                        </View>
                      )}
                    />
                  ) : (
                    <FlatList
                      data={this.props.cities}
                      renderItem={this.renderCities}
                      ListEmptyComponent={() => (
                        <View style={{height: 85, justifyContent: 'center'}}>
                          {!this.props.cities.length ? (
                            <Text
                              style={{
                                fontSize: 18,
                                textAlign: 'center',
                                color: COLORS.darkGrey,
                              }}>
                              No City Found,
                            </Text>
                          ) : null}
                        </View>
                      )}
                    />
                  )} */}
              </View>
            </View>
          </Modal>

          {/* terms and condition */}
          <View>
            <Modal
              backdropOpacity={0.8}
              deviceWidth={SIZES.width}
              deviceHeight={SIZES.height}
              backdropColor="#fff"
              isVisible={modalVisible}
              onBackdropPress={() => this.handlePress(false)}>
              <View style={styles.modalContainer}>
                <Text
                  style={{
                    color: COLORS.white,
                    fontWeight: 'bold',
                    ...FONTS.h4,
                    textAlign: FLEXBOX.center,
                  }}>
                  Accept Terms & Conditions
                </Text>
                <View style={{ width: '100%', height: 300, marginVertical: 20 }}>
                  <WebView html={terms_condition} />
                </View>
                <TouchableOpacity
                  style={styles.resetPassword}
                  onPress={() => this.onChecked('accept')}>
                  <Text style={{ ...FONTS.body4, color: COLORS.secondary }}>
                    I Accept
                  </Text>
                </TouchableOpacity>
              </View>
            </Modal>
          </View>

          {/* email confirmation */}
          <View>
            <Modal
              backdropOpacity={0.8}
              deviceWidth={SIZES.width}
              deviceHeight={SIZES.height}
              backdropColor="#fff"
              onBackdropPress={() => this.setState({ confirmationModal: !confirmationModal })}
              isVisible={confirmationModal}>
              <View
                style={[
                  styles.modalContainer,
                  {
                    backgroundColor: COLORS.primary,
                  },
                ]}>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({ confirmationModal: false }, () => {
                      this.props.navigation.navigate('Login');
                    });
                  }}
                  style={{
                    padding: 8,
                    alignItems: 'flex-end',
                    position: 'absolute',
                  }}>
                  <Entypo name="cross" color={COLORS.white} size={24} />
                </TouchableOpacity>

                <View
                  style={{
                    paddingVertical: SIZES.padding * 2,
                    // paddingHorizontal: SIZES.padding,
                  }}>
                  <Text
                    style={{
                      color: COLORS.white,
                      ...FONTS.body3,
                      textAlign: FLEXBOX.center,
                      paddingBottom: SIZES.padding * 2,
                    }}>
                    {/* Confirmation Email has been sent to registered Email
                    Address! */}
                    {'Congratulations'}
                  </Text>

                  <Text
                    style={{
                      color: COLORS.white,
                      ...FONTS.body3,
                      textAlign: FLEXBOX.center,
                    }}>
                    {/* Click on link to Activate account. */}
                    {'Account setup successfully'}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.resetPassword}
                  onPress={() => {
                    this.setState({ confirmationModal: false }, () => {
                      this.props.navigation.navigate('Login');
                    });
                  }}>

                  <Text style={{ ...FONTS.body4, color: COLORS.secondary }}>
                    Continue to login
                  </Text>

                </TouchableOpacity>
              </View>
            </Modal>
          </View>

          {/* </View> */}
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state: any) => ({
  countries: state.CountriesReducer.countries,
  states: state.CountriesReducer.states,
  cities: state.CountriesReducer.cities,
  languages: state.AuthReducer.languages,
  speciality: state.AuthReducer.speciality,
  designation: state.AuthReducer.designation,
});

const mapDispatchToProps = (dispatch: (arg0: any) => any) => {
  return {
    GetCountries: () => dispatch(CountriesMiddleware.GetCountries()),
    getAppContent: (payload: any) =>
      dispatch(AuthMiddleware.getAppContent(payload)),
    getLanguages: () => dispatch(AuthMiddleware.getLanguages()),
    getSpeciality: () => dispatch(AuthMiddleware.getSpeciality()),
    getDesignation: () => dispatch(AuthMiddleware.getDesignation()),
    GetCities: (payload: any) =>
      dispatch(CountriesMiddleware.GetCities(payload)),
    GetState: (payload: any) => dispatch(CountriesMiddleware.GetState(payload)),
    Signup: (payload: any) => dispatch(AuthMiddleware.Signup(payload)),
    SocialLogin: (payload: any) =>
      dispatch(AuthMiddleware.SocialLogin(payload)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(index);
