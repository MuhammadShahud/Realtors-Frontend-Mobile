/* eslint-disable prettier/prettier */
import React, { Component } from 'react';
import { View, ActivityIndicator, Alert, SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { connect } from 'react-redux';
import PushNotification from 'react-native-push-notification';
import Messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {
  Login,
  Signup,
  Home,
  Profile,
  EditProfile,
  Welcome,
  Realtors,
  Setting,
  Contactus,
  Notification,
  SecuritySetting, ChatInbox, InboxDetail

} from '../Screens';
import AuthActions from '../Redux/Actions/AuthActions';
import { COLORS } from '../Constants';
import LoaderAction from '../Redux/Actions/LoaderAction';
import ChatMiddleware from '../Redux/Middlewares/ChatMiddleware';

const AuthStack = createNativeStackNavigator();
const DashboardStack = createNativeStackNavigator();
const ChatBoxStack = createNativeStackNavigator();
const BottomTabs = createBottomTabNavigator();

const BottomTabsBar = () => (
  <BottomTabs.Navigator
    // initialRouteName={'ChatInbox'}
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarActiveTintColor: COLORS.primary,
      tabBarInactiveTintColor: COLORS.darkBlack,
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        color = focused ? COLORS.secondary : COLORS.darkBlack;
        if (route.name === 'Home') {
          iconName = (
            <SimpleLineIcons name="location-pin" size={25} color={color} />
          );
        } else if (route.name === 'ChatInbox') {
          iconName = <Ionicons name="chatbubbles-outline" size={25} color={color} />;
        }
        else if (route.name === 'EditProfile') {
          iconName = <FontAwesome name="user-circle" size={25} color={color} />;
        } else if (route.name === 'Notification') {
          iconName = <FontAwesome name="bell-o" size={24} color={color} />;
        } else if (route.name === 'Settings') {
          iconName = <Feather name="settings" size={25} color={color} />;
        }
        return iconName;
      },
    })}>
    <BottomTabs.Screen name="Home" component={Home} />
    <BottomTabs.Screen
      name="ChatInbox"
      component={ChatInbox}
      options={{ headerShown: false, tabBarLabel: 'Chat', }}
    />
    <BottomTabs.Screen
      name="EditProfile"
      options={{
        tabBarLabel: 'Profile',
      }}
      component={EditProfile}
    />
    <BottomTabs.Screen name="Notification" component={Notification} />
    <BottomTabs.Screen name="Settings" component={Setting} />
  </BottomTabs.Navigator>
);

const Auth = () => (
  <AuthStack.Navigator initialRouteName={'Welcome'}>
    <AuthStack.Screen
      name="Welcome"
      component={Welcome}
      options={{ headerShown: false }}
    />
    <AuthStack.Screen
      name="Login"
      component={Login}
      options={{ headerShown: false }}
    />
    <AuthStack.Screen
      name="Signup"
      component={Signup}
      options={{ headerShown: false }}
    />
  </AuthStack.Navigator>
);

const Dashboard = () => (
  <DashboardStack.Navigator initialRouteName="BottomTab">
    <DashboardStack.Screen
      name="BottomTab"
      component={BottomTabsBar}
      options={{ headerShown: false }}
    />
    <DashboardStack.Screen
      name="Profile"
      component={Profile}
      options={{ headerShown: false }}
    />
    <DashboardStack.Screen
      name="Contactus"
      component={Contactus}
      options={{ headerShown: false }}
    />
    <DashboardStack.Screen
      name="Realtors"
      component={Realtors}
      options={{ headerShown: false }}
    />
    <DashboardStack.Screen
      name="SecuritySetting"
      component={SecuritySetting}
      options={{ headerShown: false }}
    />

    <DashboardStack.Screen
      name="InboxDetail"
      component={InboxDetail}
      options={{ headerShown: false }}
    />
  </DashboardStack.Navigator>
);

interface AppNavigationProps {
  isUser: boolean;
  Login: any;
  UserLogin: any;
  Loading: any;
}

class AppNavigation extends Component<AppNavigationProps> {
  state = {
    loading: true,
  };

  IfUserLogedIn = async () => {
    const rememberMe: any = await AsyncStorage.getItem('rememberMe');
    if (rememberMe === 'false') {
      this.props.UserLogin(false);
      AsyncStorage.clear();
      this.setState({ loading: false });
    } else {
      await AsyncStorage.getItem('@User', (error, result) => {
        if (!error && result) {
          let data = JSON.parse(result);
          this.props.Login(data);
          this.props.UserLogin(true);
        }
      });
      this.setState({ loading: false });
    }
  };

  CheckIfNotificatonEnable = async () => {
    let {
      user: { user },
    } = this.props;

    // Register background handler
    Messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);
      if (user?.is_notify) {
        PushNotification.localNotification({
          /* Android Only Properties */
          ignoreInForeground: false,
          channelId: 'realtors', // (required) channelId, if the channel doesn't exist, it will be created with options passed above (importance, vibration, sound). Once the channel is created, the channel will not be update. Make sure your channelId is different if you change these options. If you have created a custom channel, it will apply options of the channel.
          showWhen: true,
          vibrate: true, // (optional) default: true
          vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
          title: remoteMessage.notification.title, // (optional)
          message: remoteMessage.notification.body, // (required)
          playSound: true, // (optional) default: true
          soundName: 'default', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
          priority: 'high',
        });
      }
    });

    Messaging().onMessage(message => {
      console.log('onMessageee', message);
      this.props.getChatInbox({ callBack: () => { } })

      if (user?.is_notify) {
        PushNotification.localNotification({
          // onlyAlertOnce : true,
          /* Android Only Properties */
          // ignoreInForeground: false,
          //channelId: 'realtors', // (required) channelId, if the channel doesn't exist, it will be created with options passed above (importance, vibration, sound). Once the channel is created, the channel will not be update. Make sure your channelId is different if you change these options. If you have created a custom channel, it will apply options of the channel.
          // showWhen: true,
          vibrate: true, // (optional) default: true
          vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
          title: message.notification.title, // (optional)
          message: message.notification.body, // (required)
          playSound: true, // (optional) default: true
          // soundName: 'default', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
          priority: 'high',
        });
      }
    });
  };

  async componentDidMount() {
    this.CheckIfNotificatonEnable();
    await this.IfUserLogedIn();
  }

  Logout = async () => {
    await AsyncStorage.removeItem('@User').then(v => {
      this.props.UserLogin(false);
    });
  };

  render() {
    let { isUser } = this.props;
    let { loading } = this.state;

    if (loading) {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      );
    } else {
      return (
        <SafeAreaView style={{ flex:1}}>
        <NavigationContainer>
          {!this.props.isUser ? <Auth /> : <Dashboard />}
          {this.props.Loading ? (
            <View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: '#00000052',
                zIndex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
          ) : null}
        </NavigationContainer>
        </SafeAreaView>
      );
    }
  }
}

const mapStateToProps = (state: any) => ({
  user: state.AuthReducer?.user,
  isUser: state.AuthReducer.isUser,
  Loading: state.LoaderReducer.Loading,
});

const mapDispathToProps = (
  dispatch: (arg0: { type: string; payload: any }) => any,
) => ({
  Login: (payload: any) => dispatch(AuthActions.Login(payload)),
  UserLogin: (payload: any) => dispatch(AuthActions.UserLogin(payload)),
  LoadingTrue: () => dispatch(LoaderAction.LoaderTrue()),
  getChatInbox: (payload) => dispatch(ChatMiddleware.getChatInbox(payload))

});
export default connect(mapStateToProps, mapDispathToProps)(AppNavigation);
