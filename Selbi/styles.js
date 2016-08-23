import { StyleSheet } from 'react-native';
import colors from './colors';


export default StyleSheet.create({
  container: {
    flex: 1,
  },
  fullScreenContainer: {
    flex: 1,
    backgroundColor: colors.primary,
    flexDirection: 'column',
    alignItems: 'center',
  },
  textLabel: {
    color: colors.dark,
    fontFamily: 'Helvetica-Bold',
    marginTop: 10,
  },
  textInput: {
    fontFamily: 'AmericanTypewriter',
    backgroundColor: colors.accent,
    color: colors.secondary,
    height: 40,
    textAlign: 'center',
  },
});
