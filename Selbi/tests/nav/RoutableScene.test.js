import React, { Text } from 'react-native';
import { shallow } from 'enzyme';
import chai, { expect } from 'chai';
import { spy } from 'sinon';
import dirtyChai from 'dirty-chai';

chai.use(dirtyChai);

import RoutableScene from '../../src/nav/RoutableScene';

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

  describe('left nav button', () => {
    it('will enable menu with openMenu and leftIs=menu', () => {
      const wrapper = shallow(<DummyRoutableScene openMenu={spy()} leftIs="menu" />);
      const navBar = wrapper.find('NavigationBar').get(0);

      expect(navBar.props.leftButton).to.exist();
      expect(navBar.props.leftButton.title).to.equal('Menu');
    });

    it('will enable back with leftIs=back', () => {
      const wrapper = shallow(<DummyRoutableScene openMenu={spy()} leftIs="back" />);
      const navBar = wrapper.find('NavigationBar').get(0);

      expect(navBar.props.leftButton).to.exist();
      expect(navBar.props.leftButton.title).to.equal('< Back');
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
});
