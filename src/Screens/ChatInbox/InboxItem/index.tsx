import React from 'react';
import { View, ScrollView, Image, TouchableOpacity, Text } from 'react-native';
import { COLORS } from '../../../Constants/Themes';
import { Img_url } from '../../../Config/APIs'
import { dummyImage } from '../../../Config/config';
import moment from 'moment';
const InboxItem = ({ avatarIcon, onPress, item, user }) => {
  let user_to_use = undefined;

  if (item?.to_user_id === user.user.id) {
    user_to_use = item.from_user;
  } else {
    user_to_use = item?.to_user;
  }
  console.log('gitem.last_messae', item)
  let date = item?.last_message?.created_at ? moment(new Date(item?.last_message?.created_at)).fromNow() : moment(new Date(item?.created_at)).fromNow()
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flexDirection: 'row',
        borderBottomWidth: 0.5,
        borderBottomColor: COLORS.lightGrey,
        height: 80,
        alignItems: 'center',
      }}>
      <Image
        style={{ height: 43, width: 43, borderRadius: 60 }}
        source={{ uri: user_to_use?.image ? Img_url + user_to_use?.image : dummyImage }}
      />
      <View style={{ flex: 1, marginHorizontal: 10 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ color: COLORS.black, fontWeight: '500', fontSize: 16, flex: 1 }} numberOfLines={1}>
            {user_to_use?.full_name ? user_to_use?.full_name : user_to_use?.f_name + ' ' + user_to_use?.l_name}
          </Text>
          <Text style={{ color: COLORS.darkGrey, fontSize: 12 }}>{date}</Text>
        </View>
        <Text style={{ color: COLORS.darkGrey }} numberOfLines={1}>
          {item?.last_message?.message}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default InboxItem;
