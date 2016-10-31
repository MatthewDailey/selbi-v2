import React, { cloneElement, Component } from 'react';
import { View, Text, TouchableHighlight } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import NavigationBar from '@selbi/react-native-navbar';

import colors from '../../colors';
import styles from '../../styles';

/*
 * Allows binding all navigator props to components which extend RoutableScene.
 *
 * @returns Function from (navigator, routeLinks, openMenu) to react element for use as the
 * route.renderContent method.
 */
export function withNavigatorProps(reactElement) {
  return (navigatorProp, routeLinksProp, openMenuProp) => cloneElement(
    reactElement,
    {
      navigator: navigatorProp,
      routeLinks: routeLinksProp,
      openMenu: openMenuProp,
    });
}

/*
 * RoutableScene is a convenience class to package the logic around having a menu bar with left and
 * right buttons plus navigating between possible scenes.
 *
 * It provides various methods goMenu, goHome, goNext, goBack for subclasses to manually invoke.
 *
 * The class is intended to be wrapped in a DrawerNavigator which contains the initial route and
 * routeLinks which determine where the route should transition to on a goBack, goNext or goHome.
 *
 * It also provides the ability to enable navbar navigation via left and right buttons by passing
 * in props:
 * - leftIs: either 'back' or 'menu' determines if the left button will go back or open the menu.
 * - rightIs: either 'next' or 'home' determine if the left button will add the scene stack or
 * clear it and go home.
 */
export default class RoutableScene extends Component {
  constructor(props) {
    super(props);
    this.goMenu = this.goMenu.bind(this);
    this.goHome = this.goHome.bind(this);
    this.goHomeHandler = this.goHomeHandler.bind(this);
    this.goNext = this.goNext.bind(this);
    this.goNextHandler = this.goNextHandler.bind(this);
    this.goBack = this.goBack.bind(this);
    this.goBackHandler = this.goBackHandler.bind(this);
    this.goReturn = this.goReturn.bind(this);
    this.goReturnHandler = this.goReturnHandler.bind(this);
    this.openSimpleScene = this.openSimpleScene.bind(this);
    this.goActionSheet = this.goActionSheet.bind(this);
  }

  onGoHome() {
    // Implemented by children.
  }

  onGoBack() {
    // Implemented by children.
  }

  onGoNext(route) {
    // Implemented by children.
  }

  onGoReturn() {
    // Implemented by children.
  }

  getLeftButton() {
    if (this.props.leftIs === 'menu' && this.props.openMenu) {
      // TODO (mdailey): fix the spacing and background color of menu button.
      return (
        <TouchableHighlight
          onPress={this.goMenu}
          style={styles.paddedCenterContainerClear}
          underlayColor={colors.transparent}
          activeOpacity={0.5}
        >
          <Text><Icon name="bars" size={18} color={colors.secondary} /></Text>
        </TouchableHighlight>
      );
    } else if (this.props.leftIs === 'back') {
      return (
        <TouchableHighlight
          onPress={this.goBackHandler}
          style={styles.paddedCenterContainerClear}
          underlayColor={colors.transparent}
          activeOpacity={0.5}
        >
          <Text><Icon name="chevron-left" size={18} color={colors.secondary} /></Text>
        </TouchableHighlight>
      );
    }
    // Return nothing. No left button.
    return undefined;
  }

  getRightButton() {
    const rightButton = {
      tintColor: colors.secondary,
    };

    if (this.props.routeLinks.actionSheet && this.props.rightIs === 'actionSheet') {
      return (
        <TouchableHighlight
          onPress={() => this.goActionSheet()}
          style={styles.paddedCenterContainerClear}
          underlayColor={colors.transparent}
          activeOpacity={0.5}
        >
          <Text><Icon name="ellipsis-v" size={18} color={colors.secondary} /></Text>
        </TouchableHighlight>
      );
    } else if (this.props.routeLinks.next && this.props.rightIs === 'next') {
      rightButton.handler = this.goNextHandler;
      rightButton.title = this.props.routeLinks.next.title;
      return rightButton;
    } else if (this.props.routeLinks.home && this.props.rightIs === 'home') {
      rightButton.handler = this.goHomeHandler;
      rightButton.title = this.props.routeLinks.home.title;
      return rightButton;
    } else if (this.props.routeLinks.return && this.props.rightIs === 'return') {
      rightButton.handler = this.goReturnHandler;
      rightButton.title = this.props.routeLinks.return.title;
      return rightButton;
    }

    // Return nothing. No right button.
    return undefined;
  }

  goActionSheet() {
    // Implemented by children.
  }

  goMenu() {
    this.props.openMenu();
  }

  shouldGoNext() {
    return true;
  }

  /*
   * Wrapper for goNext to allow passing argument.
   */
  goNextHandler() {
    this.goNext();
  }

  /*
   * Push a new route on to the right. Opens the 'next' route by default.
   */
  goNext(route = 'next') {
    if (this.shouldGoNext(route) && this.props.routeLinks[route]) {
      this.props.navigator.push(this.props.routeLinks[route].getRoute());
      this.onGoNext(route);
    }
  }

  /*
   * Wrapper for goNext to allow passing argument.
   */
  goBackHandler() {
    this.goBack();
  }

  /*
   * Drops back to the left scene.
   */
  goBack() {
    if (this.props.routeLinks.back) {
      this.props.navigator.popToRoute(this.props.routeLinks.back.getRoute());
    } else {
      this.props.navigator.pop();
    }
    this.onGoBack();
  }

  goReturnHandler() {
    this.goReturn();
  }

  shouldGoReturn() {
    return true;
  }

  goReturn() {
    if (this.shouldGoReturn()) {
      if (this.props.routeLinks.return) {
        if (this.props.routeLinks.return.getRoute) {
          this.props.navigator.popToRoute(this.props.routeLinks.return.getRoute());
        } else {
          this.props.navigator.pop();
        }
      } else {
        this.props.navigator.pop();
      }
      this.onGoReturn();
    }
  }

  goHomeHandler() {
    this.goHome();
  }

  goHome() {
    if (this.props.routeLinks.home && this.props.routeLinks.home.getRoute) {
      this.props.navigator.resetTo(this.props.routeLinks.home.getRoute());
      this.onGoHome();
    } else {
      this.props.navigator.popToTop();
      this.onGoHome();
    }
  }

  openSimpleScene(scene) {
    this.props.navigator.push({
      id: 'unconnected-scene',
      renderContent: withNavigatorProps(scene),
    });
  }

  render() {
    const title = (
      <Text
        style={{
          fontSize: 25,
          fontWeight: '300',
        }}
      >
        {this.props.title}
      </Text>
    );

    return (
      // Note this flex:1 style. Super fucking important to make sure listview can scroll.
      // Without it, the view will just bounce back. Who the fuck knows why.
      <View style={{ flex: 1, backgroundColor: colors.secondary }}>
        <NavigationBar
          tintColor={colors.primary}
          style={{ backgroundColor: colors.primary, zIndex: 2 }}
          title={{ title }}
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
  rightIs: React.PropTypes.oneOf(['next', 'home', 'return', 'actionSheet']),
};
