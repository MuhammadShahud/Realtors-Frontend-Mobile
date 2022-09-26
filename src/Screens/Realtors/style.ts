/* eslint-disable prettier/prettier */
import {StyleSheet} from 'react-native';
import {COLORS, FONTS, SIZES} from '../../Constants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  filterBody: {
    flexDirection: 'row',
    paddingHorizontal: SIZES.padding * 2,
    alignItems: 'center',
  },
  filterContainer: {
    flex: 1,
    paddingVertical: 10,
    flexDirection: 'row',
  },
  names: {
    paddingVertical: SIZES.padding + 1,
    paddingHorizontal: SIZES.padding,
    marginRight: 5,
    borderWidth: 1,
    borderColor: COLORS.darkGrey,
    borderRadius: 5,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flatList: {
    paddingHorizontal: SIZES.padding * 2,
    flex: 1,
    paddingVertical: SIZES.padding - 5,
    marginBottom: SIZES.padding,
  },
  button: {
    alignSelf: 'center',
    paddingVertical: SIZES.padding2,
    paddingHorizontal: SIZES.padding2,
    backgroundColor: COLORS.primary,
    borderRadius: 4,
    marginLeft: 5,
  },
  realtorsContainer: {
    width: '48.6%',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: COLORS.darkGrey,
    borderRadius: SIZES.radius,
    marginVertical: 5,
  },
  iconContainer: {
    width: '97%',
    height: '100%',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    position: 'absolute',
  },
  modalTitle: {
    width: '100%',
    textAlign: 'center',
    color: COLORS.white,
    fontWeight: 'bold',
    alignSelf: 'center',
    paddingBottom: SIZES.padding,
    ...FONTS.h2,
  },
  inputContainer: {
    flexDirection: 'row',
    width: '100%',
    alignSelf: 'center',
    justifyContent: 'space-between',
  },
  inputTitle: {
    fontSize: SIZES.padding2,
    color: COLORS.white,
  },
  input: {
    height: SIZES.padding * 4 + 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    flex: 1,
    borderRadius: SIZES.radius,
    marginTop: SIZES.padding - 5,
    marginBottom: SIZES.padding,
    paddingHorizontal: SIZES.padding2,
    color: COLORS.black,
    fontSize: 12,
    borderWidth: 0,
  },
  btn: {
    paddingVertical: 16,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    marginTop: SIZES.padding,
  },
  btnText: {
    textAlign: 'center',
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default styles;
