const React = require('react-native')
const {StyleSheet} = React
const constants = {
  actionColor: '#24CE84'
};

// Both palletes from lolcolors.com
const palletteOne = {
  vividRead: '#E71D36',
  teal: '#2EC4B6',
  lightTeal: '#EFFFE9',
  darkBlue: '#011627',
};

const palletteTwo = {
  lightGreen: '#67D5B5',
  pink: '#EE7785',
  purple: '#C89EC4',
  lightBlue: '#84B1ED',
};

const palleteThree = {
  vividBlue: '#45d9fd',
  offWhite: '#f4f4f4',
  vividRed: '#ee2560',
  darkBlue: '#08182b',
}


var styles = StyleSheet.create({
  container: {
    backgroundColor: '#f2f2f2',
    flex: 1,
  },
  listview: {
    flex: 1,
  },
  li: {
    backgroundColor: '#fff',
    borderBottomColor: '#eee',
    borderColor: 'transparent',
    borderWidth: 1,
    paddingLeft: 16,
    paddingTop: 14,
    paddingBottom: 16,
  },
  liContainer: {
    flex: 2,
  },
  liText: {
    color: '#333',
    fontSize: 16,
  },
  navbar: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomColor: '#eee',
    borderColor: 'transparent',
    borderWidth: 1,
    justifyContent: 'center',
    height: 44,
    flexDirection: 'row'
  },
  navbarTitle: {
    color: '#6699ff',
    fontSize: 16,
    fontWeight: '700',
  },
  statusbar: {
    backgroundColor: '#fff',
    height: 22,
  },
  center: {
    textAlign: 'center',
  },
  actionText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  action: {
    backgroundColor: constants.actionColor,
    borderColor: 'transparent',
    borderWidth: 1,
    paddingLeft: 16,
    paddingTop: 14,
    paddingBottom: 16,
  },
})

module.exports = styles;
module.exports.constants = constants;
