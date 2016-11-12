import React from 'react-native';
import { shallow } from 'enzyme';
import { spy } from 'sinon';

import ChatListComponent from '../../src/components/ChatListComponent';

const testChats = [
  {
    listingData: { title: 'Coasters', images: { image1: { url: 'url' } } },
    otherPersonPublicData: { displayName: 'Courtney' },
    listingKey: '-KQfYCq4TWSaR_EvGO9n',
    sellerUid: '2xcY7hZKe6O6QHWlsRJsZmdZAZn1',
    buyerUid: 'AFDjatxUmhUrtP7qKZ8ozHqr2NE3',
    type: 'selling',
  },
  {
    listingData: { title: 'Courts glasses', images: { image1: { url: 'url' } } },
    otherPersonPublicData: { displayName: 'Courtney' },
    listingKey: '-KQfYYZF7IsKCQGiQO69',
    sellerUid: '2xcY7hZKe6O6QHWlsRJsZmdZAZn1',
    buyerUid: 'AFDjatxUmhUrtP7qKZ8ozHqr2NE3',
    type: 'selling',
  },
];


describe('<ChatListComponent />', () => {
  let consoleErrorOutputStub;
  beforeEach(() => {
    // Proptype will log error on failure.
    consoleErrorOutputStub = spy(console, 'error');
  });

  afterEach(() => {
    console.error.restore();
  });

  it('can shallow render', () => {
    shallow(<ChatListComponent chats={testChats} refresh={spy()} openChatScene={spy()} />);
    expect(consoleErrorOutputStub.called, 'PropTypes error was logged, see logs for failure')
      .to.be.false();
  });

  it('is a ListView and removeClippedSubviews == false', () => {
    const wrapper = shallow(
      <ChatListComponent chats={testChats} refresh={spy()} openChatScene={spy()} />);

    expect(wrapper.type().displayName).to.equal('ListView');

    const listView = wrapper.get(0);
    expect(listView.props.removeClippedSubviews).to.be.false();
  });

  it('renders a ChatListItem', () => {
    const openChatSceneSpy = spy();

    const wrapper = shallow(
      <ChatListComponent chats={testChats} refresh={spy()} openChatScene={openChatSceneSpy} />);

    expect(wrapper.type().displayName).to.equal('ListView');

    const listView = wrapper.get(0);
    const chatListItem = listView.props.renderRow(testChats[0]);

    expect(chatListItem.type.name).to.equal('ChatListItem');

    expect(chatListItem.props.chatTitle).to.equal(testChats[0].listingData.title);
    expect(chatListItem.props.chatType).to.equal(testChats[0].type);

    chatListItem.props.openChatScene();
    expect(openChatSceneSpy.calledWithExactly(testChats[0])).to.be.true();
  });
});
