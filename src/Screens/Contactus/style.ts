/* eslint-disable prettier/prettier */
import {StyleSheet} from 'react-native';
import {COLORS, FLEXBOX, FONTS, SIZES} from '../../Constants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputStyles: {
    backgroundColor: COLORS.lightGrey,
    borderRadius: SIZES.radius,
    paddingVertical: SIZES.padding + 3,
    paddingHorizontal: SIZES.padding * 2,
    marginVertical: 5,
    ...FONTS.body4,
  },
  btn: {
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.primary,
    height: 60,
    alignItems: FLEXBOX.center,
    justifyContent: FLEXBOX.center,
    marginTop: SIZES.padding * 2,
  },
  contactContainer: {
    paddingHorizontal: SIZES.padding * 2,
    paddingVertical: SIZES.padding,
  },
  radioContainer: {
    flexDirection: FLEXBOX.row,
    flexWrap: 'wrap',
    justifyContent: FLEXBOX.spaceBetween,
    alignItems: FLEXBOX.center,
    paddingVertical: SIZES.padding * 3,
  },
  radioBtn: {
    width: SIZES.padding * 15,
    
    paddingVertical: SIZES.padding - 8,
    flexDirection: FLEXBOX.row,
    justifyContent: FLEXBOX.start,
  },
});
export default styles;
