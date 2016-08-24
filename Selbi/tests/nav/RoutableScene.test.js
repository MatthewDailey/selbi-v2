import React, { Text } from 'react-native';
import { shallow } from 'enzyme';
import { expect } from 'chai';

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
});
