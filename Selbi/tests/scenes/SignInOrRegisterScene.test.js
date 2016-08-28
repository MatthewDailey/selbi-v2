import React from 'react-native';
import { shallow } from 'enzyme';

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
});
