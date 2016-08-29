import { StyleSheet } from 'react-native';
import colors from './colors';

const paddingSize = 16;

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.secondary,
  },
  centerContainer: {
    flex: 1,
    backgroundColor: colors.secondary,
    alignItems: 'center',
  },
  paddedCenterContainer: {
    padding: paddingSize,
    flex: 1,
    backgroundColor: colors.secondary,
    alignItems: 'center',
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
    padding: paddingSize,
    backgroundColor: colors.secondary,
  },

  friendlyText: {
    fontSize: 20,
    fontWeight: '300',
    textAlign: 'center',
    padding: paddingSize / 2,
  },
});
