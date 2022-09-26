/* eslint-disable prettier/prettier */
import {StyleSheet} from 'react-native';
import {FLEXBOX, SIZES, COLORS, FONTS} from '../../Constants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: SIZES.padding * 3,
    backgroundColor: COLORS.white,
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
    marginBottom: 15,
    ...FONTS.body4,
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
    paddingVertical: SIZES.padding - 7,
    alignItems: FLEXBOX.center,
  },
  socialLogin: {
    flexDirection: FLEXBOX.row,
    justifyContent: FLEXBOX.center,
    alignItems: FLEXBOX.center,
    paddingVertical: SIZES.padding - 6,
  },
  signUpClick: {
    paddingTop: SIZES.padding,
    flexDirection: FLEXBOX.column,
    justifyContent: FLEXBOX.center,
  },
  blueLine: {
    alignSelf: FLEXBOX.center,
    height: 4,
    width: 125,
    backgroundColor: COLORS.secondary,
    borderRadius: SIZES.radius,
    marginTop: SIZES.padding2 + 3,
  },
  modalContainer: {
    backgroundColor: COLORS.secondary,
    borderRadius: SIZES.radius,
    paddingHorizontal: SIZES.padding * 3,
    paddingVertical: SIZES.padding * 4,
    marginHorizontal: SIZES.padding + 3,
  },
  resetPassword: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    paddingVertical: SIZES.padding,
    alignItems: FLEXBOX.center,
    alignSelf: FLEXBOX.center,
    width: 180,
  },
  icon: {
    position: 'absolute',
    right: 15,
    top: SIZES.padding * 2,
    bottom: SIZES.padding * 2,
  },
});

export default styles;
