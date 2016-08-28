import React from 'react-native';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import LoginOrRegisterScene from '../../src/scenes/SignInOrRegisterScene';

describe('<SignInOrRegisterScene />', () => {
  it('can render', () => {
    const wrapper = shallow(<SignInOrRegisterScene />);
    expect(wrapper.length).to.equal(1);
  });
});
