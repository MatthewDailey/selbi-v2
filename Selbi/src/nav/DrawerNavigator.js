import React from 'react';
import { Navigator } from 'react-native';

import Drawer from 'react-native-drawer';

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
        open
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
