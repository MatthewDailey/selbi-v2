import React, { Component } from 'react'
import { AppRegistry, View, ScrollView, ListView, Navigator, Text, TouchableHighlight } from 'react-native'
import NavigationBar from 'react-native-navbar'
import Drawer from 'react-native-drawer';

import Camera from './components/Camera'
import ListingsView from './components/ListingsView'
import Menu from './components/Menu'


const drawerStyles = {
  drawer: { shadowColor: '#000000', shadowOpacity: 0.8, shadowRadius: 0},
  main: {paddingLeft: 0},
};

class RightExpandingNavWithMenuDrawer extends React.Component {
  // noinspection Eslint - This syntax is necessary to properly bind the method.
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

    const nextButtonConfig = (navigator, title, nextRoute) => { return {
      title: title,
      handler: () => navigator.push(nextRoute)
    }};

    const getLeftButton = (navigator, routeIndex) => {
      if (routeIndex == 0) {
        return menuButtonConfig(navigator);
      }
      return backButtonConfig(navigator);
    };

    const getRightButton = (navigator, routeIndex) => {
      if (this.props.routes[routeIndex + 1]) {
        return nextButtonConfig(navigator,
          this.props.routes[routeIndex].nextLabel,
          this.props.routes[routeIndex + 1])
      }
      return doneButtonConfig(navigator);
    };

    return (
      <Drawer
        ref={(c) => {
          this.drawer = c;
        }}
        content={<Menu />}
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
                {route.renderContent()}
              </View>
            );
          }}
        />
      </Drawer>
    );
  }
}

const localListingRoutes = [
  { title: 'Listings Near You',
    nextLabel: 'Sell',
    renderContent: () => <ListingsView />,
    index: 0 },
  { title: 'Create Listing',
    renderContent: () => <Camera/>,
    index: 1 }
];

function Application() {
  return <RightExpandingNavWithMenuDrawer routes={localListingRoutes} />
}


AppRegistry.registerComponent('Selbi', () => Application);
