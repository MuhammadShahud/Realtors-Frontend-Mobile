/* eslint-disable prettier/prettier */
import React, { Component } from 'react';
import {
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  View,
  Switch,
  Alert,
  ActivityIndicator,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Header } from '../../Components';
import { Config } from '../../Config';
import styles from './style';
import { COLORS } from '../../Constants';
import { connect } from 'react-redux';
import { ChangePasswordProps } from '../../interface';
import AsyncStorage from '@react-native-async-storage/async-storage';

import ProfileMiddleware from '../../Redux/Middlewares/ProfileMiddlware';

interface SecuritySettingProps {
  changePassword: (changePasswordParams: ChangePasswordProps) => void;
  notify: any;
}
class index extends Component<SecuritySettingProps> {
  state = {
    isNotificationEnable: false,
    old_password: '',
    password: '',
    confirm_password: '',
    loader: false,
  };

  async componentDidMount() {
    let user: any = await AsyncStorage.getItem('@User');
    user = JSON.parse(user || '');
    this.setState({
      isNotificationEnable: user.user.is_notify ? true : false,
    });
  }

  onChangeText = (key: string, value: string) => this.setState({ [key]: value });

  onPressSaveSetting = () => {
    const { password, confirm_password, old_password } = this.state;
    if (password != confirm_password) {
      Alert.alert('Alert', 'New password and confirm password does not match');
      return;
    }
    // if (password.length < 8) {
    //   Alert.alert('Alert', 'Password must be at least 8 characters');
    //   return;
    // }
    this.setState({ loader: true });
    const successCallBack = () => {
      this.setState({
        old_password: '',
        password: '',
        confirm_password: '',
        loader: false,
      });
    };
    const errorCallBack = () => {
      this.setState({ loader: false });
    };
    // Call Api here
    this.props.changePassword({
      old_password: old_password,
      password: password,
      confirm_password: confirm_password,
      successCallBack: successCallBack,
      errorCallBack: errorCallBack,
    });
  };

  onChangeNotification = async (val: Boolean) => {
    let user: any = await AsyncStorage.getItem('@User');
    user = JSON.parse(user || '');

    this.setState({ isNotificationEnable: val });
    this.props.notify({ is_notify: !val ? 0 : 1 });
  };

  render() {
    const { isNotificationEnable, old_password, password, confirm_password } =
      this.state;

    return (
      <ScrollView contentContainerStyle={{ flex: 1 }}>
        <View style={styles.container}>
          <Header title="Security Settings" />
          <View style={styles.labelContainer}>
            <Text style={styles.labelText}>Change Password</Text>
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Current Password"
              secureTextEntry={true}
              placeholderTextColor={COLORS.darkGrey}
              style={styles.input}
              value={old_password}
              onChangeText={text => this.onChangeText('old_password', text)}
            />
            <TextInput
              placeholder="New Password"
              secureTextEntry={true}
              placeholderTextColor={COLORS.darkGrey}
              style={styles.input}
              value={password}
              onChangeText={text => this.onChangeText('password', text)}
            />
            <TextInput
              placeholder="Re-Type New Password"
              secureTextEntry={true}
              placeholderTextColor={COLORS.darkGrey}
              style={styles.input}
              value={confirm_password}
              onChangeText={text => this.onChangeText('confirm_password', text)}
            />
            <View style={styles.notificationLabelContainer}>
              <Text style={styles.labelText}>Notifications</Text>
              <Switch
                trackColor={{ false: COLORS.darkGrey, true: COLORS.darkGrey }}
                thumbColor={
                  isNotificationEnable ? COLORS.secondary : COLORS.lightBlack
                }
                value={isNotificationEnable}
                onValueChange={this.onChangeNotification}
              />
            </View>

            <TouchableOpacity
              disabled={this.state.loader}
              style={styles.button}
              onPress={this.onPressSaveSetting}>
              {this.state.loader ? (
                <ActivityIndicator size={'small'} color={COLORS.white} />
              ) : (
                <Text style={styles.btnText}>Save Settings</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
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
    changePassword: (payload: any) =>
      dispatch(ProfileMiddleware.ChangePassword(payload)),
    notify: (payload: any) => dispatch(ProfileMiddleware.notify(payload)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(index);
