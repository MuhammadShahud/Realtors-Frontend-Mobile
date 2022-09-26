/* eslint-disable prettier/prettier */
import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

export const COLORS = {
  // base colors
  primary: 'rgba(38, 169, 224, 1)', //sky blue
  secondary: 'rgba(60, 106, 175, 1)', // dark blue

  // colors
  black: '#282828',
  darkBlack: '#1e1f20',
  white: '#ffffff',
  darkGrey: '#c1c1c1',
  lightGrey: '#f2f2f2',
  lightBlack: '#7c7d7e',

  transparent: 'transparent',
};

export const SIZES = {
  // global sizes
  base: 8,
  font: 14,
  radius: 8,
  padding: 10,
  padding2: 12,

  // font sizes
  largetTitle: 50,
  h1: 30,
  h2: 22,
  h3: 20,
  h4: 18,
  body1: 30,
  body2: 20,
  body3: 16,
  body4: 14,
  body5: 12,

  // app dimensions
  width,
  height,
};

export const FONTS = {
  largetTitle: {
    /*fontFamily: Roboto_400Regular, */ fontSize: SIZES.largetTitle,
    lineHeight: 40,
  },
  h1: {/*fontFamily: Roboto_900Black,*/ fontSize: SIZES.h1, lineHeight: 36 },
  h2: {/*fontFamily: Roboto_700Bold, */ fontSize: SIZES.h2, lineHeight: 30 },
  h3: {/*fontFamily: Roboto_700Bold, */ fontSize: SIZES.h3, lineHeight: 22 },
  h4: {/*fontFamily: Roboto_700Bold, */ fontSize: SIZES.h4, lineHeight: 22 },
  body1: {
    /*fontFamily: Roboto_400Regular, */ fontSize: SIZES.body1,
    lineHeight: 36,
  },
  body2: {
    /*fontFamily: Roboto_400Regular, */ fontSize: SIZES.body2,
    lineHeight: 30,
  },
  body3: {
    /*fontFamily: Roboto_400Regular, */ fontSize: SIZES.body3,
    lineHeight: 22,
  },
  body4: {
    /*fontFamily: Roboto_400Regular, */ fontSize: SIZES.body4,
    lineHeight: 22,
  },
  body5: {
    /*fontFamily: Roboto_400Regular, */ fontSize: SIZES.body5,
    lineHeight: 22,
  },
};

export const FLEXBOX = {
  center: 'center',
  start: 'flex-start',
  end: 'flex-end',
  row: 'row',
  column: 'column',
  spaceBetween: 'space-between',
  spaceAround: 'space-around',
  spaceEvenly: 'space-evenly',
};

const appTheme = { COLORS, SIZES, FONTS, FLEXBOX };

export default appTheme;
