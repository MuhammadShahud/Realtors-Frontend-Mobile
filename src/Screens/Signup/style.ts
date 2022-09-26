/* eslint-disable prettier/prettier */
import {StyleSheet} from 'react-native';
import {FLEXBOX, SIZES, COLORS, FONTS} from '../../Constants';

const styles = StyleSheet.create({
  container: {
    flexDirection: FLEXBOX.column,
    justifyContent: FLEXBOX.center,
    paddingHorizontal: SIZES.padding * 3,
    paddingTop: SIZES.padding * 3,
  },
  multiSelectStyle: {
    backgroundColor: COLORS.lightGrey,
    borderRadius: SIZES.radius,
    paddingVertical: SIZES.padding - 1,
    paddingHorizontal: SIZES.padding * 3 - 5,
    marginVertical: SIZES.padding,
    ...FONTS.body4,
    borderColor: COLORS.lightGrey,
    justifyContent: 'flex-start',
  },
  logo: {
    width: 200,
    height: 200,
    alignSelf: FLEXBOX.center,
  },
  inputStyles: {
    backgroundColor: COLORS.lightGrey,
    borderRadius: SIZES.radius,
    paddingVertical: SIZES.padding * 2 - 5,
    paddingHorizontal: SIZES.padding * 3,
    marginVertical: SIZES.padding - 3,
    ...FONTS.body4,
    color: COLORS.black,
    borderColor: COLORS.lightGrey,
  },
  selectedInput: {
    backgroundColor: COLORS.lightGrey,
    borderRadius: SIZES.radius,
    paddingVertical: SIZES.padding - 1,
    paddingHorizontal: SIZES.padding * 3 - 5,
    marginVertical: SIZES.padding - 3,
    ...FONTS.body4,
    borderColor: COLORS.lightGrey,
    justifyContent: 'flex-start',
  },
  selectedStyle: {
    backgroundColor: COLORS.lightGrey,

    borderRadius: SIZES.radius,
    paddingVertical: SIZES.padding - 1,
    paddingHorizontal: SIZES.padding * 3 - 5,
    marginVertical: SIZES.padding,
    ...FONTS.body4,
    borderColor: COLORS.lightGrey,
    justifyContent: 'flex-start',
  },
  btn: {
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.primary,
    alignItems: FLEXBOX.center,
    justifyContent: FLEXBOX.center,
    marginTop: SIZES.padding,
    paddingVertical: SIZES.padding * 2 - 4,
  },
  options: {
    paddingVertical: SIZES.padding - 5,
    alignItems: FLEXBOX.center,
  },
  socialLogin: {
    flexDirection: FLEXBOX.row,
    justifyContent: FLEXBOX.center,
    alignItems: FLEXBOX.center,
    paddingVertical: SIZES.padding - 5,
  },
  signUpClick: {
    marginTop: SIZES.padding2,
    flexDirection: FLEXBOX.column,
    justifyContent: FLEXBOX.center,
  },
  blueLine: {
    alignSelf: FLEXBOX.center,
    height: 4,
    width: 125,
    backgroundColor: COLORS.secondary,
    borderRadius: SIZES.radius,
    marginTop: SIZES.padding * 2,
  },
  modalContainer: {
    backgroundColor: COLORS.secondary,
    borderRadius: SIZES.radius,
    paddingHorizontal: SIZES.padding * 3,
    paddingVertical: SIZES.padding * 4,
    marginHorizontal: SIZES.padding * 2,
  },
  resetPassword: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    paddingVertical: SIZES.padding,
    alignItems: FLEXBOX.center,
    width: 200,
    alignSelf: FLEXBOX.center,
  },
  icon: {
    position: 'absolute',
    right: 15,
    top: SIZES.padding * 2,
    bottom: SIZES.padding * 2,
  },
  notFoundName: {
    ...FONTS.body3,
    textAlign: FLEXBOX.center,
    color: COLORS.darkGrey,
  },
});

export default styles;
