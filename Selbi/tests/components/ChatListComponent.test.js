import React from 'react-native';
import { shallow } from 'enzyme';
import { spy } from 'sinon';

import ChatListComponent from '../../src/components/ChatListComponent';

const testChats = [
  {
    title: 'Coasters',
    listingId: '-KQfYCq4TWSaR_EvGO9n',
    sellerUid: '2xcY7hZKe6O6QHWlsRJsZmdZAZn1',
    buyerUid: 'AFDjatxUmhUrtP7qKZ8ozHqr2NE3',
    type: 'selling',
  },
  {
    title: 'Courts glasses',
    listingId: '-KQfYYZF7IsKCQGiQO69',
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
});
