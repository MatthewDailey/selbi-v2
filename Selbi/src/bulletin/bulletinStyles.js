import { StyleSheet } from 'react-native';
import colors from '../../colors';

export const notificationDescriptionFontSize = 18;

export default StyleSheet.create({
  bulletinText: {
    color: colors.black,
    fontSize: notificationDescriptionFontSize,
  },
  actionButtonText: {
    color: colors.black,
    fontSize: notificationDescriptionFontSize + 2,
  },
});
