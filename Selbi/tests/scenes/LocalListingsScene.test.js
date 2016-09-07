import React from 'react-native';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import ListingsScene from '../../src/scenes/LocalListingsScene';

describe('<ListingsScene />', () => {
  it('can render', () => {
    const wrapper = shallow(<ListingsScene />);
    expect(wrapper.length).to.equal(1);
  });
});
