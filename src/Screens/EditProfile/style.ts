/* eslint-disable prettier/prettier */
import {StyleSheet} from 'react-native';
import {COLORS, FLEXBOX, FONTS, SIZES} from '../../Constants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  mainImgCon: {
    alignItems: 'center',
    paddingTop: SIZES.padding * 2,
  },
  imgCon: {
    justifyContent: FLEXBOX.end,
    overflow: 'hidden',
    borderRadius: 100,
  },
  img: {
    width: 120,
    height: 120,
    borderRadius: 100,
  },

  camCon: {
    height: '30%',
    width: 120,
    position: 'absolute',
    overflow: 'hidden',
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userBox: {
    alignItems: FLEXBOX.center,
    justifyContent: FLEXBOX.center,
    paddingVertical: SIZES.padding * 2,
  },
  username: {
    ...FONTS.h4,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  signOut: {
    ...FONTS.body5,
  },
  inputContainer: {
    paddingHorizontal: SIZES.padding * 2,
  },
  inputStyles: {
    backgroundColor: COLORS.lightGrey,
    borderRadius: SIZES.radius,
    paddingVertical: SIZES.padding * 2 - 5,
    paddingHorizontal: SIZES.padding * 3,
    marginVertical: SIZES.padding,
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
  button: {
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.primary,
    height: 60,
    alignItems: FLEXBOX.center,
    justifyContent: FLEXBOX.center,
    marginVertical: SIZES.padding * 2,
  },
  btnText: {
    textAlign: 'center',
    color: '#fff',
    ...FONTS.body3,
  },
  socialContainer: {
    flexDirection: FLEXBOX.row,
    justifyContent: FLEXBOX.spaceBetween,
    alignItems: FLEXBOX.center,
  },
  socialInput: {
    flex: 1,
    padding: 0,
  },
  notFoundName: {
    ...FONTS.body3,
    textAlign: FLEXBOX.center,
    color: COLORS.darkGrey,
  },
});

export default styles;
