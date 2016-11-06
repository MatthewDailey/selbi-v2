import { StyleSheet, Platform } from 'react-native';
import colors from './colors';

export const paddingSize = 16;

export default StyleSheet.create({
  separator: {
    padding: 4,
  },
  flex: {
    flex: 1,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
  },
  container: {
    flex: 1,
    backgroundColor: colors.secondary,
  },
  centerContainer: {
    flex: 1,
    backgroundColor: colors.secondary,
    alignItems: 'center',
  },
  centerContainerClear: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paddedCenterContainer: {
    padding: paddingSize,
    flex: 1,
    backgroundColor: colors.secondary,
    alignItems: 'center',
  },
  paddedCenterContainerClear: {
    padding: paddingSize,
    flex: 1,
    alignItems: 'center',
  },
  paddedCenterContainerWhite: {
    padding: paddingSize,
    backgroundColor: colors.white,
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
    padding: paddingSize / 2,
  },
  quarterPadded: {
    padding: paddingSize / 4,
  },
  paddedContainer: {
    flex: 1,
    padding: paddingSize,
    backgroundColor: colors.secondary,
  },
  halfPaddedContainer: {
    flex: 1,
    padding: paddingSize / 2,
    backgroundColor: colors.secondary,
  },
  paddedContainerClear: {
    flex: 1,
    padding: paddingSize,
  },
  menuText: {
    color: colors.black,
    fontSize: 20,
    fontWeight: '300',
    fontFamily: Platform.OS === 'android' ? 'sans-serif-light' : undefined,
    padding: paddingSize / 2,
  },
  greyedOutMenuText: {
    fontSize: 20,
    fontWeight: '300',
    fontFamily: Platform.OS === 'android' ? 'sans-serif-light' : undefined,
    padding: paddingSize / 2,
    color: colors.greyedOut,
  },
  friendlyTextLight: {
    color: colors.white,
    fontSize: 20,
    fontWeight: '300',
    fontFamily: Platform.OS === 'android' ? 'sans-serif-light' : undefined,
    textAlign: 'center',
    padding: paddingSize / 2,
  },
  friendlyTextLightLeftAlign: {
    color: colors.white,
    fontSize: 20,
    fontWeight: '300',
    fontFamily: Platform.OS === 'android' ? 'sans-serif-light' : undefined,
    padding: paddingSize / 2,
  },
  friendlyHeaderLightLeftAlign: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '400',
    fontFamily: Platform.OS === 'android' ? 'sans-serif-light' : undefined,
    padding: paddingSize / 2,
  },
  friendlyText: {
    color: colors.black,
    fontSize: 20,
    fontWeight: '300',
    fontFamily: Platform.OS === 'android' ? 'sans-serif-light' : undefined,
    textAlign: 'center',
    padding: paddingSize / 2,
  },
  labelTextLeft: {
    fontSize: 15,
    fontWeight: '500',
  },
  friendlyTextLeft: {
    color: colors.black,
    fontSize: 20,
    fontWeight: '300',
    fontFamily: Platform.OS === 'android' ? 'sans-serif-light' : undefined,
  },
  friendlyTextLeftLarge: {
    color: colors.black,
    fontSize: 30,
    fontWeight: '300',
    fontFamily: Platform.OS === 'android' ? 'sans-serif-light' : undefined,
  },
  friendlyTextLeftMed: {
    color: colors.black,
    fontSize: 25,
    fontWeight: '300',
    fontFamily: Platform.OS === 'android' ? 'sans-serif-light' : undefined,
  },
});
