import React from 'react-native';
import { shallow } from 'enzyme';

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
});
