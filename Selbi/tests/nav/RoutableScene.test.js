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
});
