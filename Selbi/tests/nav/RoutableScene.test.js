import React, { Text, View } from 'react-native';
import { shallow } from 'enzyme';
import chai, { expect } from 'chai';
import { spy, mock } from 'sinon';
import dirtyChai from 'dirty-chai';

import RoutableScene, { withNavigatorProps } from '../../src/nav/RoutableScene';

chai.use(dirtyChai);

class DummyRoutableScene extends RoutableScene {
  renderWithNavBar() {
    return <Text>Test View</Text>;
  }
}

describe('<RoutableScene />', () => {
  it('will not render without renderWithNavBar', () => {
    expect(() => shallow(<RoutableScene />)).to.throw('renderWithNavBar');
  });

  it('can render', () => {
    const wrapper = shallow(<DummyRoutableScene />);
    expect(wrapper.length).to.equal(1);
  });

  it('withNavigatorProps properly clones and injects nav props', () => {
    const mockNavigator = {};
    const mockRouteLinks = {};
    const mockOpenMenu = {};
    const viewWithInjectedProps = withNavigatorProps(<View />)(
      mockNavigator, mockRouteLinks, mockOpenMenu);

    expect(viewWithInjectedProps.props.navigator).to.equal(mockNavigator);
    expect(viewWithInjectedProps.props.openMenu).to.equal(mockOpenMenu);
    expect(viewWithInjectedProps.props.routeLinks).to.equal(mockRouteLinks);
  });

  describe('left nav button', () => {
    it('will enable menu with openMenu and leftIs=menu', () => {
      const wrapper = shallow(<DummyRoutableScene openMenu={spy()} leftIs="menu" />);
      const navBar = wrapper.find('NavigationBar').get(0);

      expect(navBar.props.leftButton).to.exist();
      expect(navBar.props.leftButton.title).to.equal('Menu');
      expect(navBar.props.leftButton.handler.name).to.equal('bound goMenu');
    });

    it('will enable back with leftIs=back', () => {
      const wrapper = shallow(<DummyRoutableScene openMenu={spy()} leftIs="back" />);
      const navBar = wrapper.find('NavigationBar').get(0);

      expect(navBar.props.leftButton).to.exist();
      expect(navBar.props.leftButton.title).to.equal('<');
      expect(navBar.props.leftButton.handler.name).to.equal('bound goBackHandler');
    });

    it('will disable without leftIs', () => {
      const wrapper = shallow(<DummyRoutableScene openMenu={spy()} />);
      const navBar = wrapper.find('NavigationBar').get(0);

      expect(navBar.props.leftButton).to.not.exist();
    });

    it('will disable with leftIs=menu but no openMenu', () => {
      const wrapper = shallow(<DummyRoutableScene leftIs="menu" />);
      const navBar = wrapper.find('NavigationBar').get(0);

      expect(navBar.props.leftButton).to.not.exist();
    });
  });

  describe('right nav button', () => {
    it('will disable by default', () => {
      const wrapper = shallow(<DummyRoutableScene />);
      const navBar = wrapper.find('NavigationBar').get(0);
      expect(navBar.props.rightButton).to.not.exist();
    });

    it('will enable with routeLinks.next and rightIs=next', () => {
      const routeLinks = {
        next: {
          route: { /* dummy route */ },
          title: 'next dummy',
        },
      };
      const wrapper = shallow(<DummyRoutableScene rightIs="next" routeLinks={routeLinks} />);
      const navBar = wrapper.find('NavigationBar').get(0);
      expect(navBar.props.rightButton).to.exist();
      expect(navBar.props.rightButton.title).to.equal(routeLinks.next.title);
      expect(navBar.props.rightButton.handler.name).to.equal('bound goNextHandler');
    });

    it('will enable with routeLinks.home and rightIs=home', () => {
      const routeLinks = {
        home: {
          route: { /* dummy route */ },
          title: 'home dummy',
        },
      };
      const wrapper = shallow(<DummyRoutableScene routeLinks={routeLinks} rightIs="home" />);
      const navBar = wrapper.find('NavigationBar').get(0);
      expect(navBar.props.rightButton).to.exist();
      expect(navBar.props.rightButton.title).to.equal(routeLinks.home.title);
      expect(navBar.props.rightButton.handler.name).to.equal('bound goHomeHandler');
    });

    it('will disable with routeLinks but without rightIs', () => {
      const routeLinks = {
        home: {
          route: { /* dummy route */ },
          title: 'home dummy',
        },
        next: {
          route: { /* dummy route */ },
          title: 'next dummy',
        },
      };
      const wrapper = shallow(<DummyRoutableScene routeLinks={routeLinks} />);
      const navBar = wrapper.find('NavigationBar').get(0);
      expect(navBar.props.rightButton).to.not.exist();
    });

    it('will disable with rightIs=home but no routeLinks', () => {
      const wrapper = shallow(<DummyRoutableScene rightIs="home" />);
      const navBar = wrapper.find('NavigationBar').get(0);

      expect(navBar.props.leftButton).to.not.exist();
    });

    it('will disable with rightIs=next but no routeLinks', () => {
      const wrapper = shallow(<DummyRoutableScene rightIs="next" />);
      const navBar = wrapper.find('NavigationBar').get(0);

      expect(navBar.props.leftButton).to.not.exist();
    });
  });

  /*
   * This test verifies that the various RoutableScene calls will forward to the correct
   * React Native navigator calls.
   *
   * The prior suite verifies that the correct buttons end up calling the right RoutableScene
   * methods. These two combined guarantee correctness for RoutableScene.
   */
  describe('graph traversal', () => {
    const navigatorApi = {
      push: () => {},
      pop: () => {},
      popToTop: () => {},
      popToRoute: () => {},
      resetTo: () => {},
    };

    let navigatorMock = mock(navigatorApi);

    beforeEach(() => {
      navigatorMock = mock(navigatorApi);
    });

    afterEach(() => {
      navigatorMock.restore();
    });

    it('will call openMenu on goMenu', () => {
      const openMenuSpy = spy();

      navigatorMock.expects('pop').never();
      navigatorMock.expects('resetTo').never();
      navigatorMock.expects('popToRoute').never();
      navigatorMock.expects('popToTop').never();
      const scene = new RoutableScene({
        openMenu: openMenuSpy,
        leftIs: 'menu',
        navigator: navigatorMock,
      });
      scene.goMenu();

      expect(openMenuSpy.calledOnce).is.true();
      navigatorMock.verify();
    });

    it('will call push on goNext', () => {
      const nextRoute = {};
      navigatorMock.expects('push').withArgs(nextRoute);

      navigatorMock.expects('pop').never();
      navigatorMock.expects('resetTo').never();
      navigatorMock.expects('popToRoute').never();
      navigatorMock.expects('popToTop').never();
      const scene = new RoutableScene({
        leftIs: 'back',
        navigator: navigatorApi,
        routeLinks: {
          next: {
            getRoute: () => nextRoute,
            title: 'next',
          },
        },
      });
      scene.goNext();
      navigatorMock.verify();
    });

    it('will call push on getNext for custom arg', () => {
      const nextRoute = {};
      navigatorMock.expects('push').withArgs(nextRoute);

      navigatorMock.expects('pop').never();
      navigatorMock.expects('resetTo').never();
      navigatorMock.expects('popToRoute').never();
      navigatorMock.expects('popToTop').never();
      const scene = new RoutableScene({
        leftIs: 'back',
        navigator: navigatorApi,
        routeLinks: {
          coolRoute: {
            getRoute: () => nextRoute,
            title: 'next',
          },
        },
      });
      scene.goNext('coolRoute');
      navigatorMock.verify();
    });

    it('will not call push on goNext with non-existant route', () => {
      const nextRoute = {};
      navigatorMock.expects('push').never();

      const scene = new RoutableScene({
        leftIs: 'back',
        navigator: navigatorApi,
        routeLinks: {
          next: {
            getRoute: () => nextRoute,
            title: 'next',
          },
        },
      });
      scene.goNext('unknown route');
      navigatorMock.verify();
    });

    it('wont call push on goNext if shouldGoNext returns false', () => {
      const nextRoute = {};
      navigatorMock.expects('push').never();
      navigatorMock.expects('pop').never();
      navigatorMock.expects('resetTo').never();
      navigatorMock.expects('popToRoute').never();
      navigatorMock.expects('popToTop').never();
      const scene = new RoutableScene({
        leftIs: 'back',
        navigator: navigatorApi,
        routeLinks: {
          next: {
            getRoute: () => nextRoute,
            title: 'next',
          },
        },
      });
      scene.shouldGoNext = () => false;
      scene.goNext();
      navigatorMock.verify();
    });

    it('will call navigator.pop on goBack', () => {
      navigatorMock.expects('pop');

      navigatorMock.expects('resetTo').never();
      navigatorMock.expects('push').never();
      navigatorMock.expects('popToRoute').never();
      navigatorMock.expects('popToTop').never();
      const scene = new RoutableScene({
        leftIs: 'back',
        navigator: navigatorApi,
        routeLinks: {},
      });
      scene.goBack();
      navigatorMock.verify();
    });

    it('will call navigator.popToRoute on goBack with routeLinks', () => {
      const backRoute = {};
      navigatorMock.expects('popToRoute').withArgs(backRoute);

      navigatorMock.expects('pop').never();
      navigatorMock.expects('resetTo').never();
      navigatorMock.expects('push').never();
      navigatorMock.expects('popToTop').never();
      const scene = new RoutableScene({
        leftIs: 'back',
        navigator: navigatorApi,
        routeLinks: {
          back: {
            getRoute: () => backRoute,
            title: 'back',
          },
        },
      });
      scene.goBack();
      navigatorMock.verify();
    });

    it('will call navigator.popToTop on goHome with no route', () => {
      navigatorMock.expects('popToTop');

      navigatorMock.expects('pop').never();
      navigatorMock.expects('resetTo').never();
      navigatorMock.expects('push').never();
      navigatorMock.expects('popToRoute').never();
      const scene = new RoutableScene({
        leftIs: 'back',
        rightIs: 'home',
        navigator: navigatorApi,
        routeLinks: {
          home: {
            title: 'go home',
          },
        },
      });
      scene.goHome();
      navigatorMock.verify();
    });

    it('will call navigator.resetTo on goHome with route', () => {
      const homeRoute = {};
      navigatorMock.expects('resetTo').withArgs(homeRoute);

      navigatorMock.expects('popToTop').never();
      navigatorMock.expects('pop').never();
      navigatorMock.expects('push').never();
      navigatorMock.expects('popToRoute').never();
      const scene = new RoutableScene({
        leftIs: 'menu',
        navigator: navigatorApi,
        routeLinks: {
          home: {
            title: 'home',
            getRoute: () => homeRoute,
          },
        },
      });
      scene.goHome();
      navigatorMock.verify();
    });
  });
});
