import React from 'react-native';
import { shallow } from 'enzyme';
import { spy } from 'sinon';

import ChatListItem from '../../src/components/ChatListItem';

const sampleChatData = {
  title: 'sample listing',
  type: 'buying',
  buyerUid: 'my-uid',
  sellerUid: 'someone-elses-uid',
  listingId: 'cool listing',
};

describe('ChatListItem', () => {
  it('can shallow render', () => {
    shallow(<ChatListItem chatData={sampleChatData} openChatScene={() => {}} />);
  });

  it('calls openChatScene on click', () => {
    const openChatSpy = spy();
    const wrapper = shallow(<ChatListItem chatData={sampleChatData} openChatScene={openChatSpy} />);

    const outerTouchableHightlight = wrapper.get(0);
    outerTouchableHightlight.props.onPress();

    expect(openChatSpy.called).to.be.true();
  });
});
