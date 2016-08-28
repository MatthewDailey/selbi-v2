import React from 'react-native';
import { shallow } from 'enzyme';
import { spy } from 'sinon';

import SignInOrRegisterScene from '../../src/scenes/SignInOrRegisterScene';

describe('<SignInOrRegisterScene />', () => {
  const stateEmailSignIn = 'emailSignIn';
  const stateEmailRegister = 'emailRegister';
  const statePasswordSignIn = 'passwordSignIn';
  const statePasswordRegister = 'passwordRegister';


  it('can render', () => {
    const wrapper = shallow(<SignInOrRegisterScene />);
    expect(wrapper.length).to.equal(1);
  });

  it('has default state', () => {
    const wrapper = shallow(<SignInOrRegisterScene />);
    expect(wrapper.state()).to.have.all.keys([
      stateEmailSignIn,
      stateEmailRegister,
      statePasswordSignIn,
      statePasswordRegister,
    ]);
    expect(wrapper.state(stateEmailSignIn)).to.equal('');
    expect(wrapper.state(stateEmailRegister)).to.equal('');
    expect(wrapper.state(statePasswordSignIn)).to.equal('');
    expect(wrapper.state(statePasswordRegister)).to.equal('');
  });

  it('as default props', () => {
    const wrapper = shallow(<SignInOrRegisterScene />);
    expect(wrapper.instance().props).to.have.all.keys([
      'routeLinks',
      'leftIs',
      'rightIs',
    ]);
    expect(wrapper.instance().props.routeLinks).to.be.empty();
    expect(wrapper.instance().props.leftIs).to.equal(undefined);
    expect(wrapper.instance().props.rightIs).to.equal(undefined);
  });

  describe('outer view', () => {
    beforeEach(() => {
      spy(SignInOrRegisterScene.prototype, 'getInnerView');
    });

    afterEach(() => {
      SignInOrRegisterScene.prototype.getInnerView.restore();
    });

    it('has 2 children', () => {
      const signInOrRegisterWrapper = shallow(<SignInOrRegisterScene />);
      expect(signInOrRegisterWrapper.children()).to.have.lengthOf(2);
    });

    it('calls getInnerView twice to generate 2 children', () => {
      shallow(<SignInOrRegisterScene />);
      expect(SignInOrRegisterScene.prototype.getInnerView.calledTwice).to.be.true();
    });

    it('call getInnerView first for \'Sign In\'', () => {
      shallow(<SignInOrRegisterScene />);
      expect(SignInOrRegisterScene.prototype.getInnerView.firstCall
        .calledWith('Sign In'))
        .to.be.true();
    });

    it('call getInnerView second for \'Register\'', () => {
      shallow(<SignInOrRegisterScene />);
      expect(SignInOrRegisterScene.prototype.getInnerView.secondCall
        .calledWith('Register'))
        .to.be.true();
    });
  });

  describe('inner view', () => {
    it('is ScrollView', () => {
      const signInOrRegisterComponent = shallow(<SignInOrRegisterScene />).instance();
      expect(signInOrRegisterComponent.getInnerView().type.displayName).to.equal('ScrollView');
    });

    it('has tab label from arg', () => {
      const testTabLabel = 'Sign In';
      const innerView = shallow(<SignInOrRegisterScene />)
        .instance()
        .getInnerView(testTabLabel, spy());
      expect(innerView.props.tabLabel).to.equal(testTabLabel);
    });
  });
});
