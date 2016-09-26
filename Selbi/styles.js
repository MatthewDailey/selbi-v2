import { StyleSheet } from 'react-native';
import colors from './colors';

export const paddingSize = 16;

export default StyleSheet.create({
  separator: {
    padding: 4,
  },
  flex: {
    flex: 1,
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
  paddedContainerClear: {
    flex: 1,
    padding: paddingSize,
  },
  menuText: {
    fontSize: 20,
    fontWeight: '300',
    padding: paddingSize / 2,
  },
  friendlyTextLight: {
    color: colors.white,
    fontSize: 20,
    fontWeight: '300',
    textAlign: 'center',
    padding: paddingSize / 2,
  },
  friendlyTextLightLeftAlign: {
    color: colors.white,
    fontSize: 20,
    fontWeight: '300',
    padding: paddingSize / 2,
  },
  friendlyHeaderLightLeftAlign: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '400',
    padding: paddingSize / 2,
  },
  friendlyText: {
    fontSize: 20,
    fontWeight: '300',
    textAlign: 'center',
    padding: paddingSize / 2,
  },
  friendlyTextLeft: {
    fontSize: 20,
    fontWeight: '300',
    textAlign: 'center',
    padding: paddingSize / 2,
  },
});
