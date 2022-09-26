/* eslint-disable prettier/prettier */
import React, { Component } from 'react';
import {
  Image,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  View,
  Platform,
  PermissionsAndroid,
  FlatList,
  Alert,
  RefreshControl, SafeAreaView
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Header, MultiSelect } from '../../Components';
import { COLORS, FONTS, SIZES } from '../../Constants';
import styles from './style';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { connect } from 'react-redux';
import AuthMiddleware from '../../Redux/Middlewares/AuthMiddleware';
import { dummyImage, OpenImagePicker } from '../../Config/config';
import Geolocation from '@react-native-community/geolocation';
import { Img_url } from '../../Config/APIs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthActions from '../../Redux/Actions/AuthActions';
import CountriesMiddleware from '../../Redux/Middlewares/CountriesMiddleware';
import Modal from 'react-native-modal';
import CountriesAction from '../../Redux/Actions/CountriesAction';
import { Toast } from 'native-base';

interface EditProfileProps {
  image: Object;
  UpdateProfile: any;
  user: any;
  navigation: any;
  countries: any;
  states: any;
  cities: any;
  GetCountries: any;
  GetCities: any;
  GetState: any;
  UserLogin: any;
  languages: any;
  designation: any;
  speciality: any;
  getLanguages: any;
  getDesignation: any;
  getSpeciality: any;
}

class index extends Component<EditProfileProps> {
  constructor(props: EditProfileProps) {
    super(props);
    this.state = {
      image: null,
      f_name: '',
      l_name: '',
      email: '',
      license_num: '',
      phone: '',
      address: '',
      country: '',
      country_state: '',
      city: '',
      countryCode: '',
      countryId: null,
      stateId: null,
      cityId: null,
      insta_link: '',
      linkedin_link: '',
      fb_link: '',
      about: '',
      experience: '',
      // expertise: '',
      lat: '',
      lng: '',
      watchID: 0,
      imgObj: null,
      countryModal: false,
      modalType: '',
      selectedLanguagesIds: [],
      selectedSpecialityIds: [],
      selectedDesignationIds: [],
      refreshingProfile: false
    };
  }

  GetData = async () => {
    this.props.getLanguages();
    this.props.getDesignation();
    this.props.getSpeciality();
    let data = await AsyncStorage.getItem('@User');
    let userCountryData = await AsyncStorage.getItem('@UserData');
    userCountryData = JSON.parse(userCountryData);

    this.GetCountries();

    let {
      user: {
        user: {
          f_name,
          l_name,
          email,
          license_num,
          phone,
          address,
          country,
          country_id,
          state,
          state_id,
          city,
          city_id,
          insta_link,
          linkedin_link,
          fb_link,
          about,
          experience,
          // expertise,
          image,
        },
      },
    } = this.props;
    let { user } = JSON.parse(data);

    let countryName = country ? country : userCountryData.country?.name;
    let country_code = userCountryData.country?.iso3;
    let countryId = country_id ? country_id : userCountryData.country?.id;
    let stateName = state ? state : userCountryData.state?.name;
    let stateId = state ? state : userCountryData.state?.id;
    let cityName = city ? city : userCountryData.city?.name;
    let cityId = city_id ? city_id : userCountryData.city?.id;

    let selectedLanguagesIds =
      userCountryData?.UserLanguage?.map(val => val.language_ids) || [];
    let selectedSpecialityIds =
      userCountryData?.UserSpeciality?.map(val => val.speciality_ids) || [];
    let selectedDesignationIds =
      userCountryData?.UserDesignation?.map(val => val.designation_ids) || [];

    if (countryId) {
      this.props.GetState({
        id: countryId,
        country_code,
        flag: false,
        callback: (data: any) => { },
      });
    }

    if (stateId) {
      this.props.GetCities({
        id: stateId,
        countryCode: country_code,
        flag: false,
        callback: () => { },
      });
    }

    this.setState({
      f_name,
      l_name,
      email,
      license_num,
      phone,
      address,
      country: countryName,
      countryCode: country_code,
      countryId,
      country_state: stateName,
      stateId,
      city: cityName,
      cityId,
      insta_link,
      linkedin_link,
      fb_link,
      about,
      experience,
      // expertise,
      image: image ? Img_url + image : null,
      selectedLanguagesIds,
      selectedDesignationIds,
      selectedSpecialityIds,
    });
    let { watchID }: any = this.state;
    const requestLocationPermission = async () => {
      if (Platform.OS === 'ios') {
        this.getOneTimeLocation();
        this.subscribeLocationLocation();
      } else {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Location Access Required',
              message: 'This App needs to Access your location',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            this.getOneTimeLocation();
            this.subscribeLocationLocation();
          } else {
            console.log('Permission Denied');
          }
        } catch (err) {
          console.warn(err);
        }
      }
      return () => {
        Geolocation.clearWatch(watchID);
      };
    };

    requestLocationPermission();
  };

  componentDidMount() {
    this.GetData();
    this.props.navigation.addListener('focus', () => {
      this.GetData();
    });
  }

  GetCountries = () => {
    let { GetCountries } = this.props;
    GetCountries();
  };

  SelectCountry = (val: String, id: Number, country_code: String) => {
    let { GetState } = this.props;
    let { country }: any = this.state;
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
        this.setState({ refresh: true, cityId: null, stateId: null });
        this.props.ClearCity([]);
        GetState({
          id,
          country_code,
          flag: false,
          callback: (data: any) => {
            if (data.length) {
              this.setState({ refresh: false });
            } else {
              this.setState({ refresh: false });
            }
          },
        });
      },
    );
  };

  SelectState = (val: String, id: Number) => {
    let { GetCities }: any = this.props;
    let { countryCode, countryId, country_state }: any = this.state;

    if (val != country_state) {
      this.setState({
        city: '',
      });
    }
    this.setState(
      {
        country_state: val,
        stateId: id,
        // city: '',
        countryModal: false,
        cityId: null,
      },
      () => {
        GetCities({ id, countryCode, flag: false });
      },
    );
  };

  SelectCity = (val: String, id: Number) => {
    this.setState({ city: val, cityId: id, countryModal: false });
  };

  renderHome = ({ item }: any) => {
    let { modalType }: any = this.state;
    return (
      <TouchableOpacity
        onPress={
          modalType == 'country'
            ? () => this.SelectCountry(item.name, item.id, item.iso3)
            : modalType == 'state'
              ? () => this.SelectState(item.name, item.id)
              : modalType == 'city'
                ? () => this.SelectCity(item.name, item.id)
                : null
        }
        style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
        <Text style={{ fontSize: 16 }}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  getOneTimeLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        const currentLongitude = JSON.stringify(position.coords.longitude);
        const currentLatitude = JSON.stringify(position.coords.latitude);
        this.setState({
          lat: currentLatitude,
          lng: currentLongitude,
        });
      },
      error => {
        console.log('getOneTimeLocation error', error.message);
      },
      {
        enableHighAccuracy: false,
        timeout: 30000,
        maximumAge: 1000,
      },
    );
  };

  subscribeLocationLocation = () => {
    let watchID = Geolocation.watchPosition(
      position => {
        const currentLongitude = JSON.stringify(position.coords.longitude);
        const currentLatitude = JSON.stringify(position.coords.latitude);
        this.setState({
          lat: currentLatitude,
          lng: currentLongitude,
        });
      },
      error => {
        console.log('subscribeLocationLocation', error.message);
      },
      {
        enableHighAccuracy: false,
        maximumAge: 1000,
      },
    );
    this.setState({ watchID });
  };

  SelectProfilePic = () => {
    try {
      let { imgObj, image }: any = this.state;
      OpenImagePicker((img: { path: string; mime: any; size: any }) => {
        var spirit_uri = img.path.split('/');
        var name = spirit_uri[spirit_uri.length - 1];

        let imgExtension = name.split('.', 3);
        if (imgExtension[1] != 'mp4') {
          imgObj = {
            name: name,
            type: img.mime,
            uri: img.path,
            size: img.size,
          };
          image = img.path;
          this.setState({ imgObj, image });
        } else {
          Alert.alert('Error', 'Select the image for uploading')
          // Toast.show({
          //   title: 'Warning',
          //   status: 'warning',
          //   description: 'Select the image for uploading',
          //   placement: 'bottom-left',
          //   duration: 3000,
          // });
        }
      });
    } catch (error) {
      Toast.show({
        title: error.message,
      });
    }
  };

  onChangeText = (type: any, value: any) => {
    this.setState({
      [type]: value,
    });
  };

  UpdateProfile = () => {
    const {
      GetUserData,
      user: {
        token,
        user: { id },
      },
    }: any = this.props;
    let {
      imgObj,
      f_name,
      l_name,
      email,
      license_num,
      phone,
      address,
      country,
      countryId,
      country_state,
      stateId,
      city,
      cityId,
      insta_link,
      linkedin_link,
      fb_link,
      about,
      experience,
      // expertise,
      lat,
      lng,
      selectedLanguagesIds,
      selectedDesignationIds,
      selectedSpecialityIds,
    }: any = this.state;
    about && (about = about.replace(/\s{2,}/g, ' ').trim());
    if (!f_name) {
      Alert.alert('Alert', 'First name is required');
      return;
    }
    if (!l_name) {
      Alert.alert('Alert', 'Last name is required');
      return;
    }

    if (!phone) {
      Alert.alert('Alert', 'phone number is required');
      return;
    }
    if (!license_num) {
      Alert.alert('Alert', 'License number is required');
      return;
    }
    if (!address) {
      Alert.alert('Alert', 'Address is required');
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
    if (!experience) {
      Alert.alert('Alert', 'Experience is required');
      return;
    }
    // if (!expertise) {
    //   Alert.alert('Alert', 'Expertise is required');
    //   return;
    // }

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

    let numReges = /^\d+$/;
    if (experience && !numReges.test(experience)) {
      Alert.alert('Error', 'Invalid Experience');
      return;
    }

    let letters = /^[a-zA-Z\s]*$/;

    // if (expertise && !letters.test(expertise)) {
    //   Alert.alert('Alert', 'Invalid Expertise');
    //   return;
    // }

    if (f_name && !letters.test(f_name)) {
      Alert.alert('Alert', 'Invalid first name');
      return;
    }
    if (l_name && !letters.test(l_name)) {
      Alert.alert('Alert', 'Invalid last name');
      return;
    }

    let phoneRegix =
      /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;

    if (phone && !phoneRegix.test(phone)) {
      Alert.alert('Alert', 'Please enter a valid phone number');
      return;
    }

    if (
      insta_link &&
      insta_link != 'null' &&
      insta_link.toLowerCase().indexOf('instagram.com/') === -1
    ) {
      Alert.alert('Error', 'Invalid instagram profile link');
      return;
    }
    if (
      fb_link &&
      fb_link != 'null' &&
      fb_link.toLowerCase().indexOf('facebook.com/') === -1
    ) {
      Alert.alert('Error', 'Invalid facebook profile link');
      return;
    }
    if (
      linkedin_link &&
      linkedin_link != 'null' &&
      linkedin_link.toLowerCase().indexOf('linkedin.com/') === -1
    ) {
      Alert.alert('Error', 'Invalid linkedin profile link');
      return;
    }

    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!re.test(String(email).toLowerCase())) {
      Alert.alert('Error', 'Invalid email');
      return;
    }

    // if (
    //   f_name &&
    //   l_name &&
    //   license_num &&
    //   address &&
    //   country &&
    //   country_state &&
    //   experience &&
    //   expertise
    // ) {
    this.props.UpdateProfile({
      token,
      imgObj,
      f_name,
      l_name,
      email,
      license_num,
      phone,
      address,
      country,
      countryId,
      country_state,
      stateId,
      city,
      cityId,
      insta_link,
      linkedin_link,
      fb_link,
      about,
      experience,
      // expertise,
      lat,
      lng,
      selectedLanguagesIds,
      selectedDesignationIds,
      selectedSpecialityIds,
      callback: (data: any) => {
        if (data?.status == 'success') {
          this.props.navigation.navigate('Home');
          GetUserData({ token, userId: id });
        }
      },
    });
  };

  // LogOut = async () => {
  //   await AsyncStorage.removeItem('@User').then(() => {
  //     this.props.UserLogin(false);
  //   });
  // };

  // aplabetCharHandler = (value: any) => {
  //   this.setState({
  //     expertise: value.replace(/[^A-Za-z]/gi, ''),
  //   });
  // };

  componentWillUnmount() {
    let { watchID }: any = this.state;
    setTimeout(() => {
      Geolocation.clearWatch(watchID);
    }, 1000);
    this.props.navigation.removeListener('focus', () => { });
    this.props.navigation.removeListener('blur', () => { });
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

  onRefreshProfile = () => {

    this.props.getUpdatedUser({
      callback: () => {
        this.setState({ refreshingProfile: false })
        this.GetData()
      }
    })

    // return;
    const {
      GetUserData,
      user: {
        token,
        user: { id },
      },
    }: any = this.props;
    this.setState({ refreshingProfile: true })
    GetUserData({
      token, userId: id, callback: (data) => {
        this.setState({ refreshingProfile: false })
        this.GetData()
      }
    });
  }

  render() {
    let {
      image,
      f_name,
      l_name,
      email,
      license_num,
      phone,
      address,
      insta_link,
      linkedin_link,
      fb_link,
      about,
      experience,
      // expertise,
      country,
      country_state,
      city,
      modalType,
      countryModal,
      selectedLanguagesIds,
      selectedDesignationIds,
      selectedSpecialityIds,
    }: any = this.state;

    const { languages, designation, speciality } = this.props;
    console.log("THIS>PROPS>USER=>", this.props.user)
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


    // console.log()
    return (
      <SafeAreaView style={{flex:1}}>
      <ScrollView showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshingProfile}
            onRefresh={this.onRefreshProfile}
          />
        }

      >
        <View style={styles.container}>
          <Header title="Profile" />

          <View style={styles.mainImgCon}>
            <View style={styles.imgCon}>
              <Image
                source={{ uri: image ? image : dummyImage }}
                style={styles.img}
              />

              <View style={styles.camCon}>
                <TouchableOpacity onPress={this.SelectProfilePic}>
                  <FontAwesome name="camera" size={18} color="gray" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.userBox}>
            <Text style={styles.username}>
              {f_name} {l_name}
            </Text>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              placeholder="First name"
              placeholderTextColor={COLORS.darkGrey}
              style={styles.inputStyles}
              autoCapitalize="none"
              onChangeText={val => this.onChangeText('f_name', val)}
              value={f_name == 'null' ? '' : f_name}
            />
            <TextInput
              placeholder="Last name"
              placeholderTextColor={COLORS.darkGrey}
              style={styles.inputStyles}
              autoCapitalize="none"
              onChangeText={val => this.onChangeText('l_name', val)}
              value={l_name == 'null' ? '' : l_name}
            />
            <TextInput
              editable={false}
              placeholder="Email Address"
              keyboardType="email-address"
              placeholderTextColor={COLORS.darkGrey}
              style={styles.inputStyles}
              autoCapitalize="none"
              onChangeText={val => {
                this.onChangeText('email', val);
                this.setState({
                  email: val.replace(/\s/g, ''),
                });
              }}
              value={email == 'null' ? '' : email}
            />
            <MultiSelect
              popupTitle={'Select Languages'}
              styling={styles.selectedStyle}
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
              popupTitle={
                this.props.user.user?.designation_data
                  ? this.props.user.user?.designation_data[0].name
                  : 'Select Designation'
              }
              styling={styles.selectedStyle}
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
              popupTitle={
                this.props.user.user?.language_data
                  ? this.props.user.user?.language_data[0].name
                  : 'Select Speciality'
              }
              styling={styles.selectedStyle}
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
              placeholder="Phone Number"
              keyboardType="phone-pad"
              placeholderTextColor={COLORS.darkGrey}
              style={styles.inputStyles}
              autoCapitalize="none"
              onChangeText={val => this.onChangeText('phone', val)}
              value={phone == 'null' ? '' : phone}
            />
            <TextInput
              placeholder="License Number"
              // keyboardType="phone-pad"
              // keyboardType="numeric"
              placeholderTextColor={COLORS.darkGrey}
              style={styles.inputStyles}
              autoCapitalize="none"
              onChangeText={val => {
                this.onChangeText('license_num', val);
                this.setState({
                  license_num: val.replace(/\s/g, ''),
                });
              }}
              value={license_num == 'null' ? '' : license_num}
            />
            <TextInput
              placeholder="Address"
              placeholderTextColor={COLORS.darkGrey}
              style={styles.inputStyles}
              autoCapitalize="none"
              onChangeText={val => this.onChangeText('address', val)}
              value={address == 'null' ? '' : address}
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
                { paddingVertical: SIZES.padding * 2 - 3 },
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
                { paddingVertical: SIZES.padding * 2 - 3 },
              ]}>
              <Text
                style={{
                  ...FONTS.body4,
                  color: country_state ? COLORS.black : COLORS.darkGrey,
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
                { paddingVertical: SIZES.padding * 2 - 3 },
              ]}>
              <Text
                style={{
                  ...FONTS.body4,
                  color: city ? COLORS.black : COLORS.darkGrey,
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
              placeholder="Experience"
              placeholderTextColor={COLORS.darkGrey}
              style={styles.inputStyles}
              autoCapitalize="none"
              keyboardType="number-pad"
              onChangeText={val => {
                // Number(val) >= 0 ? this.onChangeText('experience', val) : null;
                this.setState({
                  experience: val.replace(/\s/g, ''),
                });
              }}
              value={experience == 'null' ? '' : experience}
            /> */}
            {/* <TextInput
              placeholder="Expertise"
              placeholderTextColor={COLORS.darkGrey}
              style={styles.inputStyles}
              autoCapitalize="none"
              onChangeText={val => {
                this.onChangeText('expertise', val);
                // this.aplabetCharHandler(val);
              }}
              value={expertise == 'null' ? '' : expertise}
            /> */}
            <View style={[styles.inputStyles, styles.socialContainer]}>
              <View style={{ flexDirection: 'row' }}>
                <TextInput
                  style={[styles.socialInput, { flex: undefined }]}
                  editable={false}
                  value={'https://'}
                />
                <TextInput
                  style={styles.socialInput}
                  placeholder="Instagram profile url"
                  placeholderTextColor={COLORS.darkGrey}
                  autoCapitalize="none"
                  onChangeText={val => this.onChangeText('insta_link', val)}
                  value={insta_link == 'null' ? '' : insta_link}
                />
              </View>
              <TouchableOpacity>
                <Entypo name="instagram" size={22} color="#a42626" />
              </TouchableOpacity>
            </View>
            <View style={[styles.inputStyles, styles.socialContainer]}>
              <View style={{ flexDirection: 'row' }}>
                <TextInput
                  style={[styles.socialInput, { flex: undefined }]}
                  editable={false}
                  value={'https://'}
                />
                <TextInput
                  style={styles.socialInput}
                  placeholder="Linkedin profile url"
                  placeholderTextColor={COLORS.darkGrey}
                  autoCapitalize="none"
                  onChangeText={val => this.onChangeText('linkedin_link', val)}
                  value={linkedin_link == 'null' ? '' : linkedin_link}
                />
              </View>

              <TouchableOpacity>
                <AntDesign name="linkedin-square" size={22} color="#0077b5" />
              </TouchableOpacity>
            </View>
            <View style={[styles.inputStyles, styles.socialContainer]}>
              <View style={{ flexDirection: 'row' }}>
                <TextInput
                  style={[styles.socialInput, { flex: undefined }]}
                  editable={false}
                  value={'https://'}
                />
                <TextInput
                  style={styles.socialInput}
                  placeholder="facebook profile url"
                  placeholderTextColor={COLORS.darkGrey}
                  autoCapitalize="none"
                  onChangeText={val => this.onChangeText('fb_link', val)}
                  value={fb_link == 'null' ? '' : fb_link}
                />
              </View>
              <TouchableOpacity>
                <Entypo name="facebook" size={22} color="#4267B2" />
              </TouchableOpacity>
            </View>
            <TextInput
              inlineImageLeft="search_icon"
              style={styles.inputStyles}
              placeholder="About"
              // numberOfLines={4}
              multiline={true}
              underlineColorAndroid="transparent"
              placeholderTextColor={COLORS.darkGrey}
              autoCapitalize="none"
              onChangeText={val => this.onChangeText('about', val)}
              value={about == 'null' ? '' : about}
            />

            <TouchableOpacity
              style={styles.button}
              onPress={this.UpdateProfile}>
              <Text style={{ color: COLORS.white, ...FONTS.body3 }}>
                Update Profile
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View>
          <Modal
            isVisible={countryModal}
            animationIn="slideInUp"
            animationOut="slideOutDown"
            backdropOpacity={0.8}
            backdropColor={COLORS.black}
            onBackdropPress={() => this.setState({ countryModal: false })}
            style={{ margin: 0 }}>
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
              </View>
            </View>
          </Modal>
        </View>
      </ScrollView>
      </SafeAreaView>
    );
  }
}
const mapStateToProps = (state: any) => {
  return {
    user: state.AuthReducer.user,
    countries: state.CountriesReducer.countries,
    states: state.CountriesReducer.states,
    cities: state.CountriesReducer.cities,
    languages: state.AuthReducer.languages,
    speciality: state.AuthReducer.speciality,
    designation: state.AuthReducer.designation,
  };
};

const mapDispatchToProps = (dispatch: (arg0: any) => any) => {
  return {
    GetCountries: () => dispatch(CountriesMiddleware.GetCountries()),
    getLanguages: () => dispatch(AuthMiddleware.getLanguages()),
    getUpdatedUser: (payload) => dispatch(AuthMiddleware.getUpdatedUser(payload)),
    getSpeciality: () => dispatch(AuthMiddleware.getSpeciality()),
    getDesignation: () => dispatch(AuthMiddleware.getDesignation()),
    GetCities: (payload: any) =>
      dispatch(CountriesMiddleware.GetCities(payload)),
    GetState: (payload: any) => dispatch(CountriesMiddleware.GetState(payload)),
    UpdateProfile: (payload: any) =>
      dispatch(AuthMiddleware.UpdateProfile(payload)),
    UserLogin: (payload: any) => dispatch(AuthActions.UserLogin(payload)),
    GetUserData: (payload: any) =>
      dispatch(AuthMiddleware.GetUserData(payload)),
    ClearCity: (payload: any) => dispatch(CountriesAction.Cities(payload)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(index);
