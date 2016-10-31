import React from 'react-native';
import { shallow } from 'enzyme';
import chai, { expect } from 'chai';
import { spy } from 'sinon';
import dirtyChai from 'dirty-chai';

import InputScene from '../../src/scenes/InputScene';

chai.use(dirtyChai);

describe('<InputScene />', () => {
  const testInputText = 'new text';

  it('can render', () => {
    const wrapper = shallow(
      <InputScene
        title="test input"
        loadInitialInput={() => 'some text'}
        routeLinks={{}}
      />
    );
    expect(wrapper.length).to.equal(1);
  });

  it('can get input value', () => {
    const scene = new InputScene({ loadInitialInput: () => undefined });
    expect(scene.parseInputValue()).to.equal(undefined);
  });

  it('dispatches event based on input change', () => {
    const recordInputSpy = spy();

    const scene = new InputScene({
      recordInput: recordInputSpy,
    });
    scene.onInputTextChange(testInputText);
    expect(recordInputSpy.calledWithExactly(testInputText)).to.be.true();
  });

  it('wont go next if no text', () => {
    const scene = new InputScene({
      loadInitialInput: () => undefined,
    });

    expect(scene.shouldGoNext()).to.be.false();
  });

  it('will go next if text', () => {
    const scene = new InputScene({
      inputValue: 'a string',
    });

    expect(scene.shouldGoNext()).to.be.true();
  });

  it('wont go next if numeric but no number', () => {
    const scene = new InputScene({
      inputValue: 'a string',
      isNumeric: true,
    });

    expect(scene.shouldGoNext()).to.be.false();
  });

  it('will go next if numeric and input is a number', () => {
    const scene = new InputScene({
      inputValue: '1.1',
      isNumeric: true,
    });

    expect(scene.shouldGoNext()).to.be.true();
  });
});
