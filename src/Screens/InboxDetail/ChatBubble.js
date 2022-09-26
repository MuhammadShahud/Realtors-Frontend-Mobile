import React from 'react';
import {View, Image, StyleSheet, Text} from 'react-native';
import {COLORS} from '../../Constants/Themes';
import moment from 'moment';
const ChatBubble = ({pullRight, item}) => {
  let messageDate = new Date(item.created_at);
  console.log(messageDate);
  return (
    <View
      key={item.id.toString()}
      style={{
        alignSelf: pullRight ? 'flex-end' : 'flex-start',
        marginVertical: 5,
      }}>
      <Text
        style={[
          {
            color: pullRight ? COLORS.white : COLORS.white,
            fontSize: 16,
            paddingHorizontal: 15,
            paddingVertical: 15,
            marginLeft: 8,
            backgroundColor: pullRight ? COLORS.primary : COLORS.lightBlack,
            textAlignVertical: 'center',
            maxWidth: '80%',
          },
          pullRight
            ? {borderRadius: 15, borderTopRightRadius: 0}
            : {borderRadius: 15, borderTopLeftRadius: 0},
        ]}>
        {item.message}
      </Text>
      <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={{color: COLORS.darkGrey, marginRight: 10, fontSize: 12}}>
            {`${moment(new Date(messageDate)).fromNow()}`}
          </Text>
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  // container: { alignSelf: pullRight ? 'flex-end' : 'flex-start', marginVertical: 5 },
});
export default ChatBubble;
