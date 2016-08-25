import { StyleSheet } from 'react-native';
import colors from './colors';


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
  padded: {
    margin: 16,
  },
  paddedContainer: {
    flex: 1,
    margin: 16,
    backgroundColor: colors.secondary,
  },
});
