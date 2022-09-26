/* eslint-disable prettier/prettier */
import {StyleSheet} from 'react-native';
import {COLORS, FLEXBOX, FONTS, SIZES} from '../../Constants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  settingContainer: {
    height: SIZES.height - 100,
    flexDirection: FLEXBOX.column,
    paddingHorizontal: SIZES.padding * 2,
    justifyContent: FLEXBOX.center,
  },
  btn: {
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.primary,
    marginVertical: SIZES.padding - 4,
    paddingVertical: SIZES.padding * 2,
    alignItems: FLEXBOX.center,
    justifyContent: FLEXBOX.center,
  },
  btnText: {
    color: COLORS.white,
    ...FONTS.body3,
  },
});
export default styles;
