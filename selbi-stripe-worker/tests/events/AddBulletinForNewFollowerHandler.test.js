import chai, { expect } from 'chai';
import dirtyChai from 'dirty-chai';

import AddBulletinForNewFollowerHandler from '../../src/events/AddBulletinForNewFollowerHandler';

chai.use(dirtyChai);

const handler = new AddBulletinForNewFollowerHandler();

describe('events - AddBulletinForNewFollowerHandler', () => {
  it('accepts \'follow\' events', () => {
    expect(handler.accept({ type: 'follow' })).to.be.true();
  });

  it('does not accept generic type', () => {
    expect(handler.accept({ type: 'arbitrary' })).to.be.false();
  });
});


