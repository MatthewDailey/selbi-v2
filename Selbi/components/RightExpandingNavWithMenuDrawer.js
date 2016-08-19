import React, { Component } from 'react'
import { View, ListView, Navigator, Text, TouchableHighlight } from 'react-native'

import NavigationBar from 'react-native-navbar'
import Drawer from 'react-native-drawer';

const drawerStyles = {
  drawer: { shadowColor: '#000000', shadowOpacity: 0.8, shadowRadius: 0},
  main: {paddingLeft: 0},
};


export default class RightExpandingNavWithMenuDrawer extends React.Component {
  openMenu = () => {
    this.drawer.open()
  };

  render() {
    const menuButtonConfig = () => { return {
      title: 'Menu',
      handler: this.openMenu,
    }};

    const backButtonConfig = (navigator) => { return {
      title: '< Back',
      handler: () => navigator.pop()
    }};

    const doneButtonConfig = (navigator) => { return {
      title: 'Done',
      handler: () => navigator.popToTop()
    }};

    const nextRoute = (routeIndex) => this.props.routes[routeIndex + 1];

    const getOpenNextFunc = (navigator, routeIndex) => {
        return () => navigator.push(nextRoute(routeIndex));
    }

    const nextButtonConfig = (navigator, title, routeIndex) => { return {
      title: title,
      handler: getOpenNextFunc(navigator, routeIndex)
    }};

    const getLeftButton = (navigator, routeIndex) => {
      if (routeIndex == 0) {
        return menuButtonConfig(navigator);
      }
      return backButtonConfig(navigator);
    };

    const getRightButton = (navigator, routeIndex) => {
      if (this.props.routes.length == 1) {
        return { title: '' }
      } else if (nextRoute(routeIndex)) {
        return nextButtonConfig(navigator,
          this.props.routes[routeIndex].nextLabel,
          routeIndex)
      }
      return doneButtonConfig(navigator);
    };

    return (
      <Drawer
        ref={(c) => {
          this.drawer = c;
        }}
        content={this.props.menu}
        tapToClose
        styles={drawerStyles}
        openDrawerOffset={0.2}
        panOpenMask={0.1}
      >
        <Navigator
          initialRoute={this.props.routes[0]}
          renderScene={(route, navigator) => {
            return (
              // Note this flex:1 style. Super fucking important to make sure listview can scroll.
              // Without it, the view will just bounce back. Who the fuck knows why.
              <View style={{flex: 1}}>
                <NavigationBar
                  title={{title: route.title}}
                  leftButton={ getLeftButton(navigator, route.index) }
                  rightButton={ getRightButton(navigator, route.index) }
                />
                {route.renderContent(getOpenNextFunc(navigator, route.index))}
              </View>
            );
          }}
        />
      </Drawer>
    );
  }
}
