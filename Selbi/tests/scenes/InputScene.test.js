import React from 'react-native';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import InputScene from '../../src/scenes/InputScene';

describe('<InputScene />', () => {
  it('can render', () => {
    const wrapper = shallow(
      <InputScene
        loadInitialInput={() => 'some text'}
      />
    );
    expect(wrapper.length).to.equal(1);
  });
});
