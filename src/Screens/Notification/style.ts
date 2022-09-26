/* eslint-disable prettier/prettier */
import { StyleSheet } from 'react-native';
import { COLORS, FLEXBOX, FONTS, SIZES } from '../../Constants';

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.white },
    notificationContainer: { height: SIZES.padding * 9, flexDirection: FLEXBOX.row, alignItems: FLEXBOX.center, marginVertical: 3, alignSelf: 'center' },
    readBGColor: { backgroundColor: '#f9f9f9' },
    unReadBGColor: { backgroundColor: COLORS.secondary },
    readUnReadContainer: { width: 40, alignItems: FLEXBOX.center, marginTop: 5 },
    readUnReadDot: { width: 10, height: 10, borderRadius: 30 },
    unReadCircleColor: { backgroundColor: '#00e5ff' },
    readCircleColor: { backgroundColor: '#acacac' },
    notificationContentContainer: { flex: 1 },
    notificationTitleText: { color: COLORS.white, ...FONTS.body3, paddingRight: 5 },
    viewLinkText: { color: COLORS.white, fontSize: 12, textDecorationLine: 'underline', marginVertical: 3 },
    timeText: { color: COLORS.white, fontSize: 12 },
    textBlack: { color: COLORS.darkBlack },
});

export default styles;
