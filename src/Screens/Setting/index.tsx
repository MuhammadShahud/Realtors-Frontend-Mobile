/* eslint-disable prettier/prettier */
import React, {Component} from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {connect} from 'react-redux';
import {Header} from '../../Components';
import {COLORS, FONTS, SIZES} from '../../Constants';
import AuthActions from '../../Redux/Actions/AuthActions';
import styles from './style';
import ProfileMiddleware from '../../Redux/Middlewares/ProfileMiddlware';

interface SettingProps {
  navigation: any;
  UserLogin: any;
}

class index extends Component<SettingProps> {
  state = {
    isSecuritySettingShow: true,
  };

  async componentDidMount() {
    let user: any = await AsyncStorage.getItem('@User');
    user = JSON.parse(user || '');
    let flag = true;
    if (user.user.type === 'google' || user.user.type === 'facebook') {
      flag = false;
    }
    this.setState({isSecuritySettingShow: flag});
  }

  handlePress = (name: any) => {
    switch (name) {
      case 'SecuritySetting':
        this.props.navigation.navigate('SecuritySetting');
        break;

      case 'contact':
        this.props.navigation.navigate('Contactus');
        break;

      case 'logout':
        this.props.navigation.navigate('Welcome');
        break;

      default:
        this.props.navigation.navigate('Setting');
    }
  };

  Logout = async () => {
    let {
      user: {token},
    } = this.props;

    await AsyncStorage.removeItem('@User').then(v => {
      this.props.UserLogin(false);
    });
    this.props.Logout({token});
  };
  render() {
    console.warn('iddd', this.props.user);
    const {isSecuritySettingShow} = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <View>
          <Header title="Settings" />
          <View style={styles.settingContainer}>
            {isSecuritySettingShow && (
              <TouchableOpacity
                style={styles.btn}
                onPress={() => this.handlePress('SecuritySetting')}>
                <Text style={styles.btnText}>Security settings</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.btn}
              onPress={() => this.handlePress('contact')}>
              <Text style={styles.btnText}>Contact Us</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btn} onPress={this.Logout}>
              <Text style={styles.btnText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state: any) => {
  return {
    user: state.AuthReducer?.user,
  };
};

const mapDispatchToProps = (dispatch: (arg0: any) => any) => {
  return {
    UserLogin: (payload: any) => dispatch(AuthActions.UserLogin(payload)),
    Logout: (payload: any) => dispatch(ProfileMiddleware.Logout(payload)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(index);
