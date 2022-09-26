import {StyleSheet} from 'react-native';
import {COLORS, SIZES} from '../../Constants';

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    flexDirection: 'row',
    borderWidth: 1,
    marginVertical: 6,
    marginHorizontal: SIZES.padding * 2 - 5,
    borderRadius: SIZES.radius,
    borderColor: COLORS.darkGrey,
  },
  right: {
    justifyContent: 'center',
    paddingVertical: 13,
    paddingHorizontal: 10,
  },
});

export default styles;
