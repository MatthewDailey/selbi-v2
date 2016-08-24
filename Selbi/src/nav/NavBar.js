import React, { Component } from 'react'
import { View, ListView, Navigator, Text, TouchableHighlight } from 'react-native'


import Drawer from 'react-native-drawer';


export default class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.openMenu = this.openMenu.bind(this);
  }

  openMenu() {
    this.drawer.open();
  }

  render() {
    return (
      <Drawer
        ref={(c) => {
          this.drawer = c;
        }}
        content={this.props.menu}
        tapToClose
        openDrawerOffset={0.2}
        panOpenMask={0.1}
      >
        <Navigator
          initialRoute={this.props.initialRoute}
          renderScene={(route, navigator) => route.renderContent(
            navigator,
            this.props.routeLinks[route.id],
            this.openMenu)}
        />

      </Drawer>
    );
  }
}
