/* eslint-disable prettier/prettier */
import React, { Component } from 'react';
import {
  View,
  SafeAreaView,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Linking,
  Platform,
} from 'react-native';
import { COLORS, FLEXBOX, FONTS, Images, SIZES } from '../../Constants';
import styles from './style';
import FaIcons from 'react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux';
import Modal from 'react-native-modal';
import AuthMiddleware from '../../Redux/Middlewares/AuthMiddleware';
import { Toast } from 'native-base';
import { WebView } from '../../Components';
import Entypo from 'react-native-vector-icons/Entypo';
import jwt_decode from 'jwt-decode';

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
import AsyncStorage from '@react-native-async-storage/async-storage';
import CheckBox from '@react-native-community/checkbox';
import Messaging from '@react-native-firebase/messaging';
import appleAuth, { appleAuthAndroid } from '@invertase/react-native-apple-authentication';

interface LoginProps {
  navigation: any;
  Login: any;
  SocialLogin: any;
  getAppContent: any;
}

export class index extends Component<LoginProps> {
  state = {
    email: '',
    password: '',
    modalVisible: false,
    resetEmail: '',
    loading: false,
    showPassword: false,
    rememberMe: true,
    terms_condition: '',
    termsAndConditionModalVisible: false,
    platform: '',
    resetSuccessModal: false,
    resetLoading: false,
    device_token: null,
  };

  IfUserLogedIn = async () => {
    await AsyncStorage.getItem('@User', (error, result) => {
      if (!error && result) {
        let data = JSON.parse(result);
      }
    });
  };

  componentDidMount = async () => {
    Messaging()
      .getToken()
      .then(token => this.setState({ device_token: token }));

    this.props.getAppContent({
      callBack: (data: any) => {
        this.setState({ terms_condition: data });
      },
    }),
      await this.IfUserLogedIn();
    GoogleSignin.configure({});
  };
  onChangeText = (type: any, value: any) => {
    this.setState({
      [type]: value,
    });
  };

  handlePress = (visible: boolean, type: String) => {
    if (type == 'terms&Condition') {
      this.setState({
        termsAndConditionModalVisible: visible,
      });
    } else {
      this.setState({
        modalVisible: visible,
      });
    }
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
  Login = async () => {
    let { email, password, rememberMe, device_token }: any = this.state;
    let { navigation } = this.props;

    if (!email && !password) {
      Alert.alert('Alert', 'Email and password is required')
      return;
    }
    if (!email) {
      Alert.alert('Alert', 'Email is required')
      return;
    }
    if (!password) {
      Alert.alert('Alert', 'Password is required')
      return;
    }
    if (email && password) {
      this.setState({ loading: true });
      this.props.Login({
        email,
        password,
        device_token,
        callback: (data: any) => {
          if (data) {
            this.setState({ loading: false });
          } else {
            this.setState({ loading: false });
          }
        },
      });
      try {
        await AsyncStorage.setItem('rememberMe', rememberMe.toString());
      } catch (error) { }
    }
  };
  ShowPasssword = () => {
    this.setState({ showPassword: !this.state.showPassword });
  };
  toggleRememberMe = () => {
    let { rememberMe }: any = this.state;
    if (!rememberMe) {
      this.setState({
        rememberMe: true,
      });
    } else if (rememberMe) {
      this.setState({
        rememberMe: false,
      });
    }
  };
  onPressSocialLoginButtons = (platform: String) => {
    this.setState({ termsAndConditionModalVisible: true, platform });
  };
  onPressAppleLogin = async  ()=>{
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL]
    });
    console.log(appleAuthRequestResponse)
    const res = jwt_decode(appleAuthRequestResponse.identityToken)
    let profile_obj = {
      f_name: '',
      l_name: '',
      email: res.email,
      type: 'apple',
    };
    this.props.SocialLogin(profile_obj);
  }
  onPressAcceptTermsAndCondition = () => {
    const { platform } = this.state;
    this.setState({ termsAndConditionModalVisible: false });
    setTimeout(() => {
      if (platform === 'google') {
        this.onPressGoogleSignIn();
      } else if(platform === 'facebook'){
        this.onPressFacebooklogin();
      }else{
        this.onPressAppleLogin()
      }
    }, 1000);
  };
  whiteSpaceHandler = (type: any, value: any) => {
    this.setState({
      [type]: value.replace(/\s/g, ''),
    });
  };

  ForgotPassword = () => {
    let { resetEmail } = this.state;
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!re.test(String(resetEmail).toLowerCase())) {
      Alert.alert('Error', 'Enter valid email');
      return;
    }

    if (resetEmail) {
      this.setState({ resetLoading: true });
      this.props.ForgotPassword({
        resetEmail,
        callback: data => {
          console.warn(data);

          if (data) {
            this.setState({
              resetLoading: false,
              modalVisible: false,
              resetSuccessModal: true,
            });
          } else {
            this.setState({ resetLoading: false });
          }
        },
      });
    }
  };

  render() {
    let {
      email,
      password,
      modalVisible,
      resetEmail,
      showPassword,
      terms_condition,
      termsAndConditionModalVisible,
      rememberMe,
    } = this.state;
    let { navigate } = this.props.navigation;
    return (
      // <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false} style={{ }}>
          {/* logo */}
          <View
            style={{
              flex: 1,
              // height: SIZES.height,
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}>
            <View>
              <Image
                source={Images.home_logo}
                resizeMode="contain"
                style={styles.logo}
              />
            </View>

            <View>
              {/* text */}
              <Text
                style={{
                  ...FONTS.h1,
                  alignSelf: FLEXBOX.center,
                  marginBottom: 20,
                }}>
                Login
              </Text>

              {/* inputs / button */}
              <View>
                <TouchableOpacity>
                  <TextInput
                    style={styles.inputStyles}
                    placeholder="Email Address"
                    placeholderTextColor={COLORS.darkGrey}
                    autoCapitalize="none"
                    onChangeText={val => {
                      this.onChangeText('email', val);
                      // this.whiteSpaceHandler('email', val);
                    }}
                    value={email}
                  />
                </TouchableOpacity>
                <TouchableOpacity>
                  <TextInput
                    style={[
                      styles.inputStyles,
                      { paddingRight: SIZES.padding * 3 + 8 },
                    ]}
                    placeholder="Password"
                    secureTextEntry={!showPassword}
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
                <TouchableOpacity style={styles.btn} onPress={this.Login}>
                  <Text style={{ color: COLORS.white, ...FONTS.body3 }}>
                    Login
                  </Text>
                </TouchableOpacity>
              </View>

              {/* remember me */}
              <View
                style={{
                  flexDirection: FLEXBOX.row,
                  alignItems: FLEXBOX.center,
                }}>
                <CheckBox
              style={{ 
                height :  20,
                width :   20,
                marginRight : 10,
              }}
       

                  tintColors={{ true: COLORS.secondary, false: COLORS.darkGrey }}
                  value={rememberMe}
                  onValueChange={this.toggleRememberMe}
                />
                <Text style={{ color: COLORS.lightBlack, ...FONTS.body5 }}>
                  Remember Me
                </Text>
              </View>
            </View>

            <View>
              {/* forget / login with */}
              <View style={{ paddingVertical: SIZES.padding }}>
                <TouchableOpacity
                  disabled
                  onPress={() => this.handlePress(true, '')}
                  style={styles.options}>
                  <Text style={{ color: COLORS.lightBlack, ...FONTS.body5 }}>
                    Forgot your password?
                  </Text>
                </TouchableOpacity>
                <View style={styles.options}>
                  <Text style={{ color: COLORS.lightBlack, ...FONTS.body5 }}>
                    or Login With
                  </Text>
                </View>
              </View>

              {/* social login */}
              <View style={{ paddingVertical: SIZES.padding - 5 }}>
                <TouchableOpacity
                  style={styles.socialLogin}
                  onPress={() => this.onPressSocialLoginButtons('facebook')}>
                  <FaIcons name="facebook" size={16} color="#367fc0" />
                  <Text
                    style={{ paddingLeft: 10, color: '#367fc0', ...FONTS.body5 }}>
                    Login with Facebook
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.socialLogin}
                  onPress={() => this.onPressSocialLoginButtons('google')}>
                  <FaIcons name="google-plus" size={16} color="#dd4b39" />
                  <Text
                    style={{ paddingLeft: 10, color: '#dd4b39', ...FONTS.body5 }}>
                    Login with Google
                  </Text>
                </TouchableOpacity>
                { Platform.OS==='ios' ?<TouchableOpacity
                  style={styles.socialLogin}
                  onPress={() => this.onPressSocialLoginButtons('apple')}>
                  <FaIcons name="apple" size={16} color="black" />
                  <Text
                    style={{ paddingLeft: 10, color: '#000', ...FONTS.body5 }}>
                    Login with Apple
                  </Text>
                </TouchableOpacity> : null }
              </View>

              {/* dont have account */}
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
                    Don't have an Account?
                  </Text>

                  <Text
                    onPress={() => navigate('Signup')}
                    style={{
                      paddingHorizontal: 5,
                      color: COLORS.primary,
                      fontWeight: 'bold',
                      ...FONTS.body4,
                    }}>
                    Sign Up
                  </Text>
                </TouchableOpacity>
                <View style={styles.blueLine} />
              </View>
            </View>
          </View>
          {/* modal forget password */}
          <View>
            <Modal
              backdropOpacity={0.8}
              deviceWidth={SIZES.width}
              deviceHeight={SIZES.height}
              backdropColor="#fff"
              isVisible={modalVisible}
              onBackdropPress={() => this.handlePress(false)}>
              <View style={styles.modalContainer}>
                <View
                  style={{
                    position: 'absolute',
                    right: 10,
                    top: 5,
                  }}>
                  <TouchableOpacity
                    onPress={() => this.setState({ modalVisible: false })}>
                    <Entypo name="cross" size={22} color={COLORS.white} />
                  </TouchableOpacity>
                </View>
                <View>
                  <Text
                    style={{
                      textAlign: FLEXBOX.center,
                      color: COLORS.white,
                      ...FONTS.h4,
                      paddingBottom: SIZES.padding,
                    }}>
                    Forgot Password?
                  </Text>
                  <Text
                    style={{
                      textAlign: FLEXBOX.center,
                      color: COLORS.white,
                      ...FONTS.body5,
                    }}>
                    Enter registered
                  </Text>
                  <Text
                    style={{
                      textAlign: FLEXBOX.center,
                      color: COLORS.white,
                      ...FONTS.body5,
                    }}>
                    Email Address to reset password!
                  </Text>
                </View>

                <View>
                  {/* <TouchableOpacity> */}
                  <TextInput
                    style={[
                      styles.inputStyles,
                      {
                        ...FONTS.body5,
                        backgroundColor: COLORS.white,
                        height: 50,
                        paddingHorizontal: SIZES.padding * 2,
                        marginVertical: SIZES.padding + 5,
                      },
                    ]}
                    placeholder="Email Address"
                    placeholderTextColor={COLORS.darkGrey}
                    autoCapitalize="none"
                    onChangeText={val => this.onChangeText('resetEmail', val)}
                    value={resetEmail}
                  />
                  {/* </TouchableOpacity> */}

                  <TouchableOpacity
                    disabled={this.state.resetLoading || !this.state.resetEmail}
                    style={styles.resetPassword}
                    onPress={this.ForgotPassword}>
                    {this.state.resetLoading ? (
                      <ActivityIndicator size={20} color={COLORS.secondary} />
                    ) : (
                      <Text style={{ ...FONTS.body4, color: COLORS.secondary }}>
                        Reset Password
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </View>

          {/* Reset Success Modal */}
          <View>
            <Modal
              backdropOpacity={0.8}
              deviceWidth={SIZES.width}
              deviceHeight={SIZES.height}
              backdropColor="#fff"
              isVisible={this.state.resetSuccessModal}
              onBackdropPress={() => this.handlePress(false)}>
              <View style={styles.modalContainer}>
                <View
                  style={{
                    position: 'absolute',
                    right: 10,
                    top: 5,
                  }}>
                  <TouchableOpacity
                    onPress={() => this.setState({ resetSuccessModal: false })}>
                    <Entypo name="cross" size={22} color={COLORS.white} />
                  </TouchableOpacity>
                </View>

                <Text
                  style={{
                    textAlign: FLEXBOX.center,
                    color: COLORS.white,
                    ...FONTS.h2,
                    paddingBottom: SIZES.padding,
                  }}>
                  Success
                </Text>

                <Text
                  style={{
                    textAlign: FLEXBOX.center,
                    color: COLORS.white,
                    paddingBottom: SIZES.padding,
                  }}>
                  Link has been sent to your email.
                </Text>
              </View>
            </Modal>
          </View>

          {/* terms and condition */}
          <View>
            <Modal
              backdropOpacity={0.8}
              deviceWidth={SIZES.width}
              deviceHeight={SIZES.height}
              backdropColor="#fff"
              isVisible={termsAndConditionModalVisible}
              onBackdropPress={() =>
                this.handlePress(false, 'terms&Condition')
              }>
              <View style={styles.modalContainer}>
                <TouchableOpacity
                  style={{ position: 'absolute', right: 15, top: 15 }}
                  onPress={() => this.handlePress(false, 'terms&Condition')}>
                  <FaIcons name="remove" size={16} color={COLORS.white} />
                </TouchableOpacity>

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
                  onPress={this.onPressAcceptTermsAndCondition}>
                  <Text style={{ ...FONTS.body4, color: COLORS.secondary }}>
                    I Accept
                  </Text>
                </TouchableOpacity>
              </View>
            </Modal>
          </View>
        </ScrollView>

        {/* <View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}>
          <View style={styles.blueLine} />
        </View> */}
      </View>
    );
  }
}

const mapDispatchToProps = (dispatch: (arg0: any) => any) => {
  return {
    getAppContent: (payload: any) =>
      dispatch(AuthMiddleware.getAppContent(payload)),
    Login: (payload: any) => dispatch(AuthMiddleware.Login(payload)),
    ForgotPassword: (payload: any) =>
      dispatch(AuthMiddleware.ForgotPassword(payload)),
    SocialLogin: (payload: any) =>
      dispatch(AuthMiddleware.SocialLogin(payload)),
  };
};
export default connect(null, mapDispatchToProps)(index);
