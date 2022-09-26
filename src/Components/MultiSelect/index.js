/* eslint-disable prettier/prettier */
import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Select2 from 'react-native-select-two';
import {FLEXBOX, SIZES, COLORS, FONTS} from '../../Constants';

// create a component
const MultiSelect = ({
  data,
  onPressSave,
  popupTitle,
  title,
  searchPlaceHolderText,
  isSelectSingle,
  styling,
  titleStyle,
}) => {
  return (
    <View style={{flex: 1}}>
      <Select2
        isSelectSingle={isSelectSingle}
        style={styling}
        selectedTitleStyle={titleStyle}
        colorTheme={COLORS.primary}
        popupTitle={popupTitle}
        title={title}
        cancelButtonText={'Close'}
        selectButtonText={'Save'}
        searchPlaceHolderText={searchPlaceHolderText}
        data={data}
        listEmptyTitle={'Data not available'}
        onSelect={onPressSave}
        buttonStyle={styles.buttonStyle}
        onRemoveItem={onPressSave}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  buttonStyle: {
    borderRadius: SIZES.radius,
    height: 40,
    alignItems: 'center',
    paddingHorizontal: 0,
    maxWidth: '42%',
  },
});

export default MultiSelect;
