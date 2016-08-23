import React from 'react-native';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import LoginOrRegisterScene from '../../src/scenes/LoginOrRegisterScene';

describe('<LoginOrRegisterScene />', () => {
  it('can render', () => {
    const wrapper = shallow(<LoginOrRegisterScene />);
    expect(wrapper.length).to.equal(1);
  });
});
