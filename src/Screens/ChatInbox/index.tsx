/* eslint-disable prettier/prettier */
import React, { Component } from 'react';
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Linking,
  SafeAreaView,
  Image,

} from 'react-native';
import { Header } from '../../Components';
import { COLORS, SIZES } from '../../Constants';
import { connect } from 'react-redux';
import styles from './style';
import NotificationMiddleware from '../../Redux/Middlewares/NotificationMiddleware';
import ChatMiddleware from '../../Redux/Middlewares/ChatMiddleware';
import moment from 'moment';
import InboxItem from './InboxItem';

interface ChatInboxProps {
  getChatInbox: (payload: any) => void;
}
class index extends Component<ChatInboxProps> {
  state = {
    refreshing: false
  }
  componentDidMount() {
    this.setState({ refreshing: true })
    this.props.getChatInbox({ callBack: this.callBack })
    this.props.navigation.addListener('focus', () => {
      // this.setState({ refreshing: true })
      console.log('FOUCUS GET CHATS')
      this.props.getChatInbox({ callBack: this.callBack })
    })
  }

  componentWillUnmount() {
    this.props.navigation.removeListener('focus', () => { });

  }

  callBack = () => this.setState({ refreshing: false })

  onRefresh = () => {
    this.setState({ refreshing: true })
    this.props.getChatInbox({ callBack: this.callBack })

  }
  render() {
    console.log('itemitemitem 45=>', this.props.chatInbox)
    return (
      <SafeAreaView style={{flex:1}}>
      <View style={styles.container}>
        <Header title={'Inbox'} />
        <FlatList
          ListEmptyComponent={() => {
            return (
              <View
                style={{
                  marginVertical: 8,
                  alignSelf: 'center',
                }}>
                <Text style={{ fontSize: 16, color: COLORS.darkGrey }}>
                  No messages to show
                </Text>
              </View>
            );
          }}
          style={{ flex: 1, paddingHorizontal: 25 }}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
            />
          }
          keyExtractor={(item, index) => index.toString()}
          data={this.props.chatInbox}
          renderItem={({ item, index }) => {
            return (
              <InboxItem user={this.props.user} item={item} onPress={() => this.props.navigation.navigate('InboxDetail', { item })} />
            )
          }}
        />
      </View>
      </SafeAreaView>
    );
  }
}

const mapDispatchToProps = (dispatch: (arg0: any) => any) => {
  return {
    getChatInbox: (payload) => dispatch(ChatMiddleware.getChatInbox(payload))
  };
};

const mapStateToProps = state => {
  return {
    chatInbox: state.ChatReducer.chatInbox,
    user: state.AuthReducer.user
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(index);
