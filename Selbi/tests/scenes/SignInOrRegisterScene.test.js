import React from 'react-native';
import { shallow } from 'enzyme';
import { spy, mock } from 'sinon';

import SignInOrRegisterScene, { TabTypes } from '../../src/scenes/SignInOrRegisterScene';

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
        .calledWith(TabTypes.signIn))
        .to.be.true();
    });

    it('call getInnerView second for \'Register\'', () => {
      shallow(<SignInOrRegisterScene />);
      expect(SignInOrRegisterScene.prototype.getInnerView.secondCall
        .calledWith(TabTypes.register))
        .to.be.true();
    });
  });

  describe('inner view', () => {
    it('is ScrollView', () => {
      const signInOrRegisterComponent = shallow(<SignInOrRegisterScene />).instance();
      expect(signInOrRegisterComponent.getInnerView(TabTypes.signIn, spy()).type.displayName)
        .to.equal('ScrollView');
    });

    it('has tab label from arg', () => {
      const innerView = shallow(<SignInOrRegisterScene />)
        .instance()
        .getInnerView(TabTypes.signIn, spy());
      expect(innerView.props.tabLabel).to.equal(TabTypes.signIn.asTitle);
    });

    function atleastOneChildMatches(reactComponent, predicate) {
      return shallow(reactComponent)
        .instance()
        .props
        .children
        .map(predicate)
        .reduce((previousValue, currentValue) => previousValue || currentValue);
    }

    it('has email input for sign in', () => {
      const innerView = shallow(<SignInOrRegisterScene />)
        .instance()
        .getInnerView(TabTypes.signIn, spy());

      expect(atleastOneChildMatches(innerView, (child) => child.props.placeholder === 'Email'))
        .to.be.true();
    });

    it('has password input for sign in', () => {
      const innerView = shallow(<SignInOrRegisterScene />)
        .instance()
        .getInnerView(TabTypes.signIn, spy());

      expect(atleastOneChildMatches(innerView, (child) => child.props.placeholder === 'Password'))
        .to.be.true();
    });

    it('no first name input for register', () => {
      const innerView = shallow(<SignInOrRegisterScene />)
        .instance()
        .getInnerView(TabTypes.signIn, spy());

      expect(atleastOneChildMatches(innerView, (child) => child.props.placeholder === 'First Name'))
        .to.be.false();
    });

    it('no last name input for sign in', () => {
      const innerView = shallow(<SignInOrRegisterScene />)
        .instance()
        .getInnerView(TabTypes.signIn, spy());

      expect(atleastOneChildMatches(innerView, (child) => child.props.placeholder === 'Last Name'))
        .to.be.false();
    });

    it('has email input for register', () => {
      const innerView = shallow(<SignInOrRegisterScene />)
        .instance()
        .getInnerView(TabTypes.register, spy());

      expect(atleastOneChildMatches(innerView, (child) => child.props.placeholder === 'Email'))
        .to.be.true();
    });

    it('has password input for register', () => {
      const innerView = shallow(<SignInOrRegisterScene />)
        .instance()
        .getInnerView(TabTypes.register, spy());

      expect(atleastOneChildMatches(innerView, (child) => child.props.placeholder === 'Password'))
        .to.be.true();
    });

    it('has first name input for register', () => {
      const innerView = shallow(<SignInOrRegisterScene />)
        .instance()
        .getInnerView(TabTypes.register, spy());

      expect(atleastOneChildMatches(innerView, (child) => child.props.placeholder === 'First Name'))
        .to.be.true();
    });

    it('has last name input for register', () => {
      const innerView = shallow(<SignInOrRegisterScene />)
        .instance()
        .getInnerView(TabTypes.register, spy());

      expect(atleastOneChildMatches(innerView, (child) => child.props.placeholder === 'Last Name'))
        .to.be.true();
    });
  });

  describe('register and sign in', () => {
    let signInOrRegisterWrapper;
    let mockSignInWithEmail;
    let mockRegisterWithEmail;

    beforeEach(() => {
      mockSignInWithEmail = spy(() => Promise.resolve());
      mockRegisterWithEmail = spy(() => Promise.resolve());

      signInOrRegisterWrapper = shallow(
        <SignInOrRegisterScene
          registerWithEmail={mockRegisterWithEmail}
          signInWithEmail={mockSignInWithEmail}
        />
      );
      signInOrRegisterWrapper.setState({
        emailSignIn: 'email-signin',
        emailRegister: 'email-register',
        passwordSignIn: 'password-signin',
        passwordRegister: 'password-register',
      });
    });

    it('calls sign in with correct email and pw', () => {
      signInOrRegisterWrapper.instance().signInWithEmailAndPassword();

      expect(mockSignInWithEmail.calledWithExactly('email-signin', 'password-signin'))
        .to.be.true();
      expect(mockRegisterWithEmail.neverCalledWith()).to.be.true();
    });

    it('calls register with correct email and pw', () => {
      signInOrRegisterWrapper.instance().registerUserWithEmailAndPassword();

      expect(mockSignInWithEmail.neverCalledWith()).to.be.true();
      expect(mockRegisterWithEmail.calledWithExactly('email-register', 'password-register'))
        .to.be.true();
    });
  });
});
