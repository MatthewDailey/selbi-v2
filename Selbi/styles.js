import { StyleSheet } from 'react-native';
import colors from './colors';

const paddingSize = 16;

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.secondary,
  },
  fullScreenContainer: {
    flex: 1,
    backgroundColor: colors.primary,
    flexDirection: 'column',
  },
  paddedFullScreenContainer: {
    flex: 1,
    backgroundColor: colors.primary,
    flexDirection: 'column',
    padding: paddingSize,
  },
  padded: {
    margin: paddingSize,
  },
  halfPadded: {
    margin: paddingSize / 2,
  },
  paddedContainer: {
    flex: 1,
    margin: paddingSize,
    backgroundColor: colors.secondary,
  },
});
