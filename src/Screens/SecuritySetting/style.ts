/* eslint-disable prettier/prettier */
import {StyleSheet} from 'react-native';
import {COLORS, FLEXBOX, FONTS, SIZES} from '../../Constants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  labelText: {
    flex: 1,
    color: COLORS.lightBlack,
    paddingHorizontal: SIZES.padding,
  },
  labelContainer: {
    paddingHorizontal: 20,
    marginTop: 25,
    marginBottom: 10,
  },
  notificationLabelContainer: {
    flexDirection: 'row',
    paddingVertical: SIZES.padding,
  },
  inputContainer: {
    paddingHorizontal: SIZES.padding * 2,
  },
  input: {
    backgroundColor: COLORS.lightGrey,
    borderRadius: SIZES.radius,
    paddingVertical: SIZES.padding + 3,
    paddingHorizontal: SIZES.padding * 2,
    marginVertical: SIZES.padding,
    ...FONTS.body4,
    height: 60,
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
});

export default styles;
