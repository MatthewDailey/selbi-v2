import { StyleSheet } from 'react-native';
import colors from '../../colors';

export const notificationDescriptionFontSize = 14;

export default StyleSheet.create({
  actionButtonText: {
    color: colors.black,
    fontSize: notificationDescriptionFontSize,
    fontWeight: '300',
  },
  dismissButtonText: {
    color: colors.black,
    fontSize: notificationDescriptionFontSize - 4,
    fontWeight: '300',
  },
});
