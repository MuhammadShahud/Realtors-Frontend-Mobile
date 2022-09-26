/* eslint-disable prettier/prettier */
import {StyleSheet} from 'react-native';
import {COLORS, FONTS} from '../../Constants';

const styles = StyleSheet.create({
  container: {
    height: 56,
    flexDirection: 'row',
    backgroundColor: COLORS.white,
  },
  imgContainer: {
    width: 65,
    alignItems: 'center',
    justifyContent: 'center',
  },
  img: {
    width: 30,
    height: 30,
    borderRadius: 100,
  },
  titleView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...FONTS.body2,
    // flex: 1,
  },
  headerLeft: {
    width: 65,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default styles;
