/* eslint-disable prettier/prettier */
import {StyleSheet} from 'react-native';
import {COLORS, FLEXBOX, SIZES} from './../../Constants/Themes';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pageMaterial: {
    position: 'absolute',
    top: 0,
    bottom: 30,
    left: 0,
    right: 0,
    flexDirection: FLEXBOX.column,
    justifyContent: FLEXBOX.center,
    paddingHorizontal: SIZES.padding * 4,
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: SIZES.padding2 * 8,
    alignSelf: FLEXBOX.center,
  },
  btn: {
    borderRadius: SIZES.radius,
    paddingVertical: SIZES.padding + 10,
    paddingHorizontal: SIZES.padding * 2,
    marginVertical: 5,
  },
  text: {
    color: COLORS.white,
    textAlign: 'center',
  },
  modalContainer: {
    backgroundColor: COLORS.secondary,
    borderRadius: SIZES.radius,
    paddingHorizontal: SIZES.padding * 6,
    paddingVertical: SIZES.padding * 8,
    marginHorizontal: SIZES.padding * 2,
  },
  modal: {
    marginVertical: 15,
    flexDirection: FLEXBOX.row,
    justifyContent: FLEXBOX.spaceBetween,
  },
  modalBtn: {
    borderRadius: SIZES.radius - 4,
    backgroundColor: COLORS.white,
    flex: 1,
    paddingVertical: SIZES.padding - 2,
    marginHorizontal: 5,
  },
});

export default styles;
