import FastImage from 'react-native-fast-image';
import React, {useState} from 'react';
import {View, ActivityIndicator, Text} from 'react-native';
import {COLORS} from '../../Constants';

export default ({source, style, resizeMode}) => {
  const [isLoader, setIsLoader] = useState(false);
   return (
    <View style={{}}>
      <FastImage
        style={style}
        source={source}
        resizeMode={resizeMode}
        onLoadStart={() => setIsLoader(true)}
        onLoadEnd={() => setIsLoader(false)}
      />
      {isLoader ? (
        <View style={{position: 'absolute', top: '45%', left: '45%'}}>
          <ActivityIndicator size={32} color={COLORS.primary} />
          <Text style={{textAlign: 'center', fontSize: 12, marginVertical: 5}}>
            Loading...
          </Text>
        </View>
      ) : null}
    </View>
  );
};
