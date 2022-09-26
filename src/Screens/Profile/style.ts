/* eslint-disable prettier/prettier */
import {StyleSheet} from 'react-native';
import {FONTS, SIZES} from '../../Constants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  bodyContainer: {
    flex: 1,
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: SIZES.padding * 3,
    paddingVertical: SIZES.padding * 2,
  },
  username: {
    paddingHorizontal: 16,
    paddingVertical: SIZES.padding2,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
  },
  contactContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SIZES.base * 2,
  },
  aboutContainer: {
    alignSelf: 'center',
    paddingHorizontal: SIZES.padding,
    paddingTop: SIZES.padding * 2,
  },
  socialIconContainer: {
    alignSelf: 'center',
    flexDirection: 'row',
  },
  infoContainer: {
    width: '100%',
    marginTop: SIZES.base,
    alignSelf: 'center',
  },
  titles: {
    textAlign: 'center',
    fontWeight: 'bold',
    ...FONTS.body4,
  },
  details: {
    textAlign: 'center',
    textTransform: 'capitalize',
    fontSize: SIZES.padding2,
    lineHeight: SIZES.font,
  },
});

export default styles;
