import React, { Component } from 'react';
import { View } from 'react-native';

import NavigationBar from '@selbi/react-native-navbar';

import colors from '../../colors';

export default class RoutableScene extends Component {
  constructor(props) {
    super(props);
    this.goMenu = this.goMenu.bind(this)
    this.goHome = this.goHome.bind(this);
    this.goNext = this.goNext.bind(this);
    this.goBack = this.goBack.bind(this);
  }

  getLeftButton() {
    const leftButton = {
      tintColor: colors.secondary,
    };
    if (this.props.leftIs === 'menu' && this.props.openMenu) {
      leftButton.title = 'Menu';
      leftButton.handler = this.goMenu;
      return leftButton;
    } else if (this.props.leftIs === 'back') {
      leftButton.title = '< Back';
      leftButton.handler = this.goBack;
      return leftButton;
    }
    // Return nothing. No left button.
    return undefined;
  }

  getRightButton() {
    const rightButton = {
      tintColor: colors.secondary,
    };

    if (this.props.routeLinks.next && this.props.rightIs === 'next') {
      rightButton.handler = this.goNext;
      rightButton.title = this.props.routeLinks.next.title;
      return rightButton;
    } else if (this.props.routeLinks.home && this.props.rightIs === 'home') {
      rightButton.handler = this.goHome;
      rightButton.title = this.props.routeLinks.home.title;
      return rightButton;
    }

    // Return nothing. No right button.
    return undefined;
  }

  goMenu() {
    this.props.openMenu();
  }

  goNext() {
    if (this.props.routeLinks.next) {
      this.props.navigator.push(this.props.routeLinks.next.getRoute());
    }
  }

  goBack() {
    if (this.props.routeLinks.prev) {
      this.props.navigator.popToRoute(this.props.routeLinks.prev.getRoute());
    } else {
      this.props.navigator.pop();
    }
  }

  goHome() {
    if (this.props.routeLinks.home) {
      const homeRoute = this.props.routeLinks.home.getRoute();
      if (homeRoute) {
        this.props.navigator.resetTo(homeRoute);
      } else {
        this.props.navigator.popToTop();
      }
    }
  }

  render() {
    return (
      // Note this flex:1 style. Super fucking important to make sure listview can scroll.
      // Without it, the view will just bounce back. Who the fuck knows why.
      <View style={{ flex: 1, backgroundColor: colors.accent }}>
        <NavigationBar
          tintColor={colors.primary}
          style={{ backgroundColor: colors.primary }}
          title={{ title: this.props.title, tintColor: colors.dark }}
          leftButton={this.getLeftButton()}
          rightButton={this.getRightButton()}
        />
        {this.renderWithNavBar()}
      </View>
    );
  }
}

RoutableScene.defaultProps = {
  routeLinks: {},
  leftIs: undefined,
  rightIs: undefined,
};

RoutableScene.propTypes = {
  title: React.PropTypes.string,
  openMenu: React.PropTypes.func,
  navigator: React.PropTypes.object,
  routeLinks: React.PropTypes.object,
  leftIs: React.PropTypes.oneOf(['back', 'menu']),
  rightIs: React.PropTypes.oneOf(['next', 'home']),
};