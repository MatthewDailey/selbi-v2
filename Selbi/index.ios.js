import React, { Component } from 'react'
import { AppRegistry, View, ScrollView, ListView, Navigator, Text, TouchableHighlight } from 'react-native'
import NavigationBar from 'react-native-navbar'

import Camera from './components/Camera'
import ListingsView from './components/ListingsView'
import Menu from './components/Menu'

class ListMobile extends Component {
  render() {
    const menuButtonConfig = () => { return {
      title: 'Menu',
      handler: this.props.openDrawer,
    }};

    const backButtonConfig = (navigator) => { return {
      title: '< Back',
      handler: () => navigator.pop()
    }};

    const doneButtonConfig = (navigator) => { return {
      title: 'Done',
      handler: () => navigator.popToTop()
    }};

    const routes = [
      { title: 'Listings Near You',
        left: menuButtonConfig,
        right: (navigator) => { return {
          title: 'Sell',
          handler: () => navigator.push(routes[1]),
        }},
        renderContent: () => <ListingsView />,
        index: 0 },
      { title: 'Create Listing',
        left: backButtonConfig,
        right: doneButtonConfig,
        renderContent: () => <Camera/>,
        showSimple: true,
        index: 1 }
    ];

    return (
      <Navigator
        initialRoute={routes[0]}
        renderScene={(route, navigator) => {
          return (
            // Note this flex:1 style. Super fucking important to make sure listview can scroll.
            // Without it, the view will just bounce back. Who the fuck knows why.
            <View style={{flex: 1}}>
              <NavigationBar
                title={{title: route.title}}
                leftButton={route.left(navigator)}
                rightButton={route.right(navigator)}
              />
              {route.renderContent()}
            </View>
          );
        }}
      />
    );
  }
}

import Drawer from 'react-native-drawer';

const drawerStyles = {
  drawer: { shadowColor: '#000000', shadowOpacity: 0.8, shadowRadius: 0},
  main: {paddingLeft: 0},
};



class Application extends React.Component {
  // noinspection Eslint - This syntax is necessary to properly bind the method.
  openControlPanel = () => {
    this.drawer.open()
  };

  render() {
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
        <ListMobile openDrawer={this.openControlPanel} />
      </Drawer>
    );
  }
}


AppRegistry.registerComponent('Selbi', () => Application);
