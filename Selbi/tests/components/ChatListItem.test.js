import React from 'react-native';
import { shallow } from 'enzyme';
import { spy } from 'sinon';

import ChatListItem from '../../src/components/ChatListItem';

describe('<ChatListItem />', () => {
  let consoleErrorOutputStub;
  beforeEach(() => {
    // Proptype will log error on failure.
    consoleErrorOutputStub = spy(console, 'error');
  });

  afterEach(() => {
    console.error.restore();
  });

  it('can shallow render', () => {
    shallow(<ChatListItem
      chatTitle={'test title'}
      chatType={'buying'}
      openChatScene={() => {}}
      otherPersonDisplayName="Courtney"
    />);
    expect(consoleErrorOutputStub.called, 'PropTypes error was logged, see logs for failure')
      .to.be.false();
  });

  it('calls openChatScene on click', () => {
    const openChatSpy = spy();
    const wrapper = shallow(
      <ChatListItem chatTitle={'test title'} chatType={'buying'} openChatScene={openChatSpy} />);

    const outerTouchableHightlight = wrapper.get(0);
    outerTouchableHightlight.props.onPress();

    expect(openChatSpy.calledWithExactly()).to.be.true();
  });
});
