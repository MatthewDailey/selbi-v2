import React from 'react-native';
import { shallow } from 'enzyme';
import chai, { expect } from 'chai';
import { spy, mock, stub } from 'sinon';
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
      />
    );
    expect(wrapper.length).to.equal(1);
  });

  it('can get input value', () => {
    const scene = new InputScene({ loadInitialInput: () => undefined });
    expect(scene.getInputValue()).to.equal(undefined);
  });

  it('sets state based on input change', () => {
    const setStateSpy = spy();
    const scene = new InputScene({ loadInitialInput: () => undefined });
    scene.setState = setStateSpy;

    scene.onInputTextChange(testInputText);

    expect(setStateSpy.calledWith({ text: testInputText }));
  });

  it('dispatches event based on input change', () => {
    const action = { test: 'action' };
    const recordInputActionSpy = stub().returns(action);
    recordInputActionSpy.returnValue = action;

    const storeApi = { dispatch: () => {} };
    const mockStore = mock(storeApi);
    mockStore.expects('dispatch').withArgs(action);

    const scene = new InputScene({
      loadInitialInput: () => undefined,
      recordInputAction: recordInputActionSpy,
      store: storeApi,
    });
    scene.setState = (data, callback) => callback();

    scene.onInputTextChange(testInputText);
    mockStore.verify();
  });

  it('wont go next if no text', () => {
    const scene = new InputScene({
      loadInitialInput: () => undefined,
    });

    expect(scene.shouldGoNext()).to.be.false();
  });

  it('will go next if text', () => {
    const scene = new InputScene({
      loadInitialInput: () => 'a string',
    });

    expect(scene.shouldGoNext()).to.be.true();
  });

  it('wont go next if numeric but no number', () => {
    const scene = new InputScene({
      loadInitialInput: () => 'a string',
      isNumeric: true,
    });

    expect(scene.shouldGoNext()).to.be.false();
  });

  it('will go next if numeric and input is a number', () => {
    const scene = new InputScene({
      loadInitialInput: () => '1.1',
    });

    expect(scene.shouldGoNext()).to.be.true();
  });
});
