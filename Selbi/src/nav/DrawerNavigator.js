import React from 'react';
import { Navigator, BackAndroid } from 'react-native';

import Drawer from 'react-native-drawer';

import { reportOpenScene } from '../SelbiAnalytics';
import PermissionsWatcher from '../nav/PermissionsWatcher';

/*
 * DrawerNavigator manages a graph of scenes and transitions between scenes while providing a
 * convenience wrapper for a left-side drawer menu.
 *
 * It takes 'props.routeLinks' which defines a series of transitions between routes and
 * 'props.initialRoute' which defines the starting node in the scene graph.
 *
 * At a minimum, an route must have an 'id' field and a method 'renderContent' which takes the
 * navigator, any routeLinks associated with the route id and the openMenu function.
 *
 * For maximum utility, Routes should extend RoutableScene which provides convenience methods for
 * rendering a scene with a navigation bar and transitioning between scenes.
 */
export default class DrawerNavigator extends React.Component {
  constructor(props) {
    super(props);
    this.openMenu = this.openMenu.bind(this);
    this.closeMenu = this.closeMenu.bind(this);
  }

  openMenu() {
    this.drawer.open();
  }

  closeMenu() {
    this.drawer.close();
  }

  render() {
    BackAndroid.addEventListener('hardwareBackPress', () => {
      if (this.navigator.getCurrentRoutes().length > 1) {
        this.navigator.pop();
      } else {
        BackAndroid.exitApp();
      }
      return true;
    });


    return (
      <Navigator
        ref={(c) => { this.navigator = c; }}
        initialRoute={this.props.initialRoute}
        onDidFocus={(route) => reportOpenScene(route.id)}
        renderScene={(route, navigator) => {
          console.log('Rendering: ', route);
          return (
            <Drawer
              ref={(c) => { this.drawer = c; }}
              content={this.props.renderMenuWithNavigator(navigator, this.closeMenu)}
              tapToClose
              openDrawerOffset={0.2}
              panOpenMask={0.1}
            >
              {route.renderContent(navigator, this.props.routeLinks[route.id], this.openMenu)}
              {this.props.renderDeepLinkListener(navigator)}
              <PermissionsWatcher />
            </Drawer>
          );
        }}
      />
    );
  }
}
