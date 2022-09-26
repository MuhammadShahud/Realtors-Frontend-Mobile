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
  Linking, SafeAreaView
} from 'react-native';
import { Header } from '../../Components';
import { COLORS, SIZES } from '../../Constants';
import { connect } from 'react-redux';
import styles from './style';
import NotificationMiddleware from '../../Redux/Middlewares/NotificationMiddleware';
import moment from 'moment';

interface NotificationProps {
  getNotificationList: any;
  updateNotification: () => void;
  notificationList: any;
  isReadNotifications: any;
}
class index extends Component<NotificationProps> {
  componentDidMount() {
    this.props.getNotificationList({ page_number: 1 });
    this.props.isReadNotifications();
  }
  render() {
    const { notificationList } = this.props;

    console.warn('dasdas', notificationList);

    return (
      <SafeAreaView style={{flex:1}}>
      <View style={styles.container}>
        <Header title={'Notification'} />
        <FlatList
          refreshControl={
            <RefreshControl refreshing={notificationList ? false : true} />
          }
          ListEmptyComponent={() =>
            notificationList && notificationList.data?.length == 0 ? (
              <View style={{ flex: 1, alignItems: 'center' }}>
                <Text style={{ fontSize: 16, color: COLORS.darkGrey }}>
                  No Notification found
                </Text>
              </View>
            ) : null
          }
          style={{ paddingVertical: SIZES.padding * 2 }}
          data={notificationList ? notificationList.data : []}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <View
              style={[
                styles.notificationContainer,
                item.is_read ? styles.readBGColor : styles.unReadBGColor,
              ]}>
              <View style={styles.readUnReadContainer}>
                <View
                  style={[
                    styles.readUnReadDot,
                    item.is_read
                      ? styles.readCircleColor
                      : styles.unReadCircleColor,
                  ]}
                />
              </View>
              <View style={styles.notificationContentContainer}>
                <Text
                  style={[
                    styles.notificationTitleText,
                    item.is_read && styles.textBlack,
                  ]}>
                  {item.title}
                </Text>
                {/* {!item.is_read && (
                  <TouchableOpacity
                    onPress={() =>
                      Linking.openURL(`mailto: yaqoobmussab@gmail.com`)
                    }>
                    <Text style={styles.viewLinkText}>View Link</Text>
                  </TouchableOpacity>
                )} */}
                <Text
                  style={[styles.timeText, item.is_read && styles.textBlack]}>
                  {/* {item.created_at ? new Date(item.created_at).toDateString() : ''} */}
                  {moment(item.created_at).fromNow()}
                </Text>
              </View>
            </View>
          )}
        />
        {/* {notificationList && notificationList.data?.length == 0 ? <View>
          <Text>No Data found</Text>
        </View> : null} */}
      </View>
      </SafeAreaView>
    );
  }
}

const mapDispatchToProps = (dispatch: (arg0: any) => any) => {
  return {
    isReadNotifications: () =>
      dispatch(NotificationMiddleware.isReadNotifications()),
    getNotificationList: payload =>
      dispatch(NotificationMiddleware.getNotificationList(payload)),
  };
};

const mapStateToProps = state => {
  return {
    notificationList: state.NotificationReducer?.notificationList,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(index);
