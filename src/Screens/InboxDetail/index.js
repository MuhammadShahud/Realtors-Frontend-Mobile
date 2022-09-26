/* eslint-disable prettier/prettier */
import React, {Component} from 'react';
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Linking,
  Image,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import DeviceInfo from 'react-native-device-info';

import {Header} from '../../Components';
import {COLORS, SIZES} from '../../Constants';
import {connect} from 'react-redux';
// import styles from './style';
import NotificationMiddleware from '../../Redux/Middlewares/NotificationMiddleware';
import moment from 'moment';
import Feather from 'react-native-vector-icons/Feather';
import ChatBubble from './ChatBubble';
import Pusher from 'pusher-js/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import APIs from '../../Config/APIs';
import {ApiRequest, BearerHeaders} from '../../Config/config';
import ChatMiddleware from '../../Redux/Middlewares/ChatMiddleware';

class index extends Component {
  state = {
    message: '',
    chatList: [],
    currentUserId: undefined,
    recentChatResponse: null,
    loader: false,
    onScrollLoader: false,
  };

  async componentDidMount() {
    this.initializeComponent();
    // this.props.navigation.addListener('focus', () => {
    //   console.log();
    //   this.initializeComponent();
    // });
  }

  initializeComponent = async () => {
    this.getRecentsMessages();

    let user = await AsyncStorage.getItem('@User');
    user = JSON.parse(user || '');
    console.log('Current User =>', user.user);

    this.setState({currentUserId: user.user.id});

    //----------------------------------
    const item = this.props.route.params.item;
    // user_to_use => Recipient User
    let user_to_use = undefined;
    if (item?.to_user_id === this.props.user.user.id) {
      user_to_use = item.from_user;
    } else {
      user_to_use = item.to_user;
    }
    console.log('user_to_use 665', user_to_use);
    //----------------------------------

    this.pusher = new Pusher('6f6a046416ec1f857e7c', {cluster: 'ap2'});
    this.chatChannel = this.pusher.subscribe(`realtor.${user.user.id}`);
    this.chatChannel.bind('App\\Events\\Message', data => {
      console.log(data);
      if (
        data.message &&
        (data.message.sent_to_id === user.user.id ||
          data.message.sent_from_id == user.user.id) &&
        (data.message.sent_to_id === user_to_use.id ||
          data.message.sent_from_id == user_to_use.id)
      ) {
        this.state.chatList?.unshift(data.message);
        this.setState({chatList: this.state.chatList});
      }
    });
  };

  componentWillUnmount() {
    this.chatChannel.unsubscribe();
    this.props.navigation.removeListener('focus', () => {});
  }

  getRecentsMessages = (page = 1) => {
    const item = this.props.route.params.item;
    console.log('94 ITEm---->',item)
    this.setState({onScrollLoader: true});
    this.props.getRecentMessages({
      chatlist_id: item.id,
      page: page,
      callBack: data => {
        this.setState(
          {
            recentChatResponse: data,
            chatList: [...this.state.chatList, ...data.data],
            onScrollLoader: false,
          },
          () => {
            setTimeout(() => {
              page == 1 && this.chatList?.scrollToEnd({animated: true});
            }, 0);
          },
        );
      },
    });
  };

  onPressSendMessage = async () => {
    if (this.state.message) {
      this.setState({loader: true});
      const item = this.props.route.params.item;
      let user_to_use = undefined;
      if (item?.to_user_id === this.props.user.user.id) {
        user_to_use = item.from_user;
      } else {
        user_to_use = item.to_user;
      }
      this.props.sendMessage({
        to_user: user_to_use.id,
        message: this.state.message,
        callBack: res => {
          this.setState({loader: false, message: ''});
          if (res) {
            console.log('RESPONSE=?', res);
            this.state.chatList?.unshift(res);
            this.setState({chatList: this.state.chatList, message: ''}, () => {
              setTimeout(() => {
                //  this.chatList.scrollTo({animated: true});
              }, 10);
            });
          }
        },
      });
    }
  };

  scrollToEnd = () => this.chatList?.scrollToEnd({animated: true});

  loadMoreMessages = () => {
    if (
      this.state.recentChatResponse.current_page + 1 <=
      this.state.recentChatResponse.last_page
    ) {
      this.setState({onScrollLoader: true});
      this.getRecentsMessages(this.state.recentChatResponse.current_page + 1);
    }
  };

  render() {
    let hasNotch = DeviceInfo.hasNotch();

    const {message, currentUserId, chatList, recentChatResponse} = this.state;
    const item = this.props.route.params.item;
    let user_to_use = undefined;

    if (item?.to_user_id === this.props.user.user.id) {
      user_to_use = item.from_user;
    } else {
      user_to_use = item.to_user;
    }

    console.log('Loader', this.state.loader);
    return (
      <KeyboardAvoidingView 
      keyboardVerticalOffset={Platform.OS === 'ios' ?(hasNotch ? 46 : 20) : undefined}
      behavior={Platform.OS === 'ios' ?  ('padding') : 'height'} 
      
      style={{flex:1}}>
      <View style={{flex: 1, backgroundColor: COLORS.white}}>
        <Header
          title={
            user_to_use.full_name
              ? user_to_use.full_name
              : user_to_use.f_name + ' ' + user_to_use.l_name
          }
        />
        {this.state.onScrollLoader && this.state.chatList.length ? (
          <ActivityIndicator color={COLORS.primary} />
        ) : null}
        <FlatList
          style={{flex: 1, paddingHorizontal: 25}}
          ref={ref => (this.chatList = ref)}
          data={chatList}
          inverted={chatList.length > 0 ? true : false}
          onEndReached={this.loadMoreMessages}
          onEndReachedThreshold={0.7}
          ListEmptyComponent={() => {
            return this.state.onScrollLoader ? (
              <ActivityIndicator color={COLORS.primary} />
            ) : (
              <View
                style={{
                  marginVertical: 8,
                  alignSelf: 'center',
                }}>
                <Text style={{fontSize: 16, color: COLORS.darkGrey}}>
                  No messages to show
                </Text>
              </View>
            );
          }}
          renderItem={({item}) => {
            return (
              <ChatBubble
                key={item.id.toString()}
                item={item}
                pullRight={item.sent_from_id === currentUserId}
              />
            );
          }}
        />
        <View
          style={{
            height: 50,
            borderWidth: 0.4,
            borderColor: COLORS.lightBlack,
            marginHorizontal: 5,
            borderRadius: 5,
            flexDirection: 'row',
            paddingHorizontal: 10,
            marginBottom : 15
          
          }}>
          <TextInput
            style={{flex: 1, fontSize: 16}}
            placeholder={'Type a message'}
            value={message}
            onChangeText={text => this.setState({message: text})}
          />
          <TouchableOpacity
            onPress={this.onPressSendMessage}
            // onPress={this.test}
            disabled={this.state.loader}
            style={{
              padding: 10,
              backgroundColor: COLORS.primary,
              borderRadius: 100,
              alignSelf: 'center',
            }}>
            {this.state.loader ? (
              <ActivityIndicator color={'white'} size={15} />
            ) : (
              <Feather name="send" color={COLORS.white} size={15} />
            )}
          </TouchableOpacity>
        </View>
      </View>
      </KeyboardAvoidingView>
    );
  }
}

const mapDispatchToProps = (dispatch: (arg0: any) => any) => {
  return {
    sendMessage: (payload: any) =>
      dispatch(ChatMiddleware.sendMessage(payload)),
    getRecentMessages: (payload: any) =>
      dispatch(ChatMiddleware.getRecentMessages(payload)),
  };
};

const mapStateToProps = state => {
  return {
    user: state.AuthReducer.user,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(index);
